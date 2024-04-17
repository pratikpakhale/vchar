# Google this

## Post request Google Advanced search

```
{{baseurl}}/search?q='text'
```

### Body

```json
{
  "options": {
    "safe": false,
    "page": 1,
    "params": {
      "before": "2016",
      "after": "2003",
      "related": "nytimes.coms",
      "inachor": "investment",
      "intext": "company name"
    }
  }
}
```

### Response 

results array with links and descriptions and text

## Get request image search with text

```
{{baseurl}}/image?q='text'
```

### Response 

result json with image results links

