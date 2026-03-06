 import { getMcpClient } from "$lib/common/server/mcp";
 import { json } from "@sveltejs/kit";

 export async function GET() {
   const client = await getMcpClient();
   const { tools } = await client.listTools();
   return json(tools);
 }
