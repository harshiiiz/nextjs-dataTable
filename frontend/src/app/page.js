import Head from "next/head";
import DataTable from "../app/components/DataTable";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Data Table</title>
      </Head>
      <h1>Data Table</h1>
      <DataTable />
    </div>
  );
}
