import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";


//@ts-ignore
export function NewsCard({ news, index }) {
    return (
        <Card style={{ height: '150px', overflow: 'hidden', width: '700px' }} className="hover:border-purple">
            <div className="flex flex-row p-4 items-center">
                <div className="flex p-5" style={{ width: '120px', height: '120px' }}>

                    <img
                        src={news?.favicons?.high_res}
                        className="w-full h-full object-contain"
                        alt="News Image"
                        style={{ minWidth: '100%', minHeight: '100%' }}
                    />

                </div>
                <div className="flex flex-col flex-grow">
                    <div className="flex flex-col space-y-3   cursor-pointer">
                        <CardTitle className="hover:text-purple hover:underline"><a href={news?.url}>{news?.title}</a></CardTitle>
                        <CardDescription>
                            {news?.description}
                        </CardDescription>
                    </div>

                </div>
            </div>
        </Card>
    );
}
