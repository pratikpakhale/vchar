import fs from 'fs';
import path from 'path';

interface Conversation {
  prompt: string;
  context: string;
  answer: string;
  sources: {
    title: string;
    description: string;
    url: string;
    favicon: string;
  }[];
}

export interface Store {
  get(key: string): Conversation[];
  set(key: string, value: Conversation[]): void;
}

const PATH = path.join(__dirname, '../db/store.json');

if (!fs.existsSync(PATH)) {
  fs.writeFileSync(PATH, JSON.stringify({}));
}

export class JSONStore implements Store {
  constructor() {
    if (!fs.existsSync(PATH)) {
      fs.writeFileSync(PATH, JSON.stringify({}));
    }
  }

  private data: Record<string, Conversation[]> = JSON.parse(
    fs.readFileSync(PATH, 'utf-8')
  );

  getAll = () => this.data;

  get(key: string): Conversation[] {
    return this.data[key] || [];
  }

  set(key: string, value: Conversation[]): void {
    this.data[key] = value;
    fs.writeFileSync(PATH, JSON.stringify(this.data));
  }

  append(key: string, value: Conversation): void {
    this.data[key] = [...(this.data[key] || []), value];
    fs.writeFileSync(PATH, JSON.stringify(this.data));
  }

  delete(key: string): void {
    delete this.data[key];
    fs.writeFileSync(PATH, JSON.stringify(this.data, null, 2));
  }
}
