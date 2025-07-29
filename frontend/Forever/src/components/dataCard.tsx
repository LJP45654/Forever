import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

function DataCard({ children, ...props }: any) {
  return (
    <Card className='w-[400px] from-primary/4 to-card bg-gradient-to-t shadow-xs' style={{ fontFamily: 'Roboto' }}>
      <CardHeader>
        <CardTitle className='text-2xl'>{props?.title}</CardTitle>
        <CardDescription>{props?.description}</CardDescription>
        <CardAction>{props?.action}</CardAction>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}

export default DataCard