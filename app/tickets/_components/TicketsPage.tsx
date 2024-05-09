import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "@/app/_components/link-tabs-data";
import NameComponent from "@/app/_components/name-component";
import TicketsTab from "@/app/tickets/_components/TicketsTab";

const TicketsPage = () => {
  return (
    <>
      <section className="mb-10">
        <div
          style={{
            margin: "auto",
            //display: "flex",
            width: "85%",
            alignContent: "center",
            marginTop: "2vh",
          }}
        >
          <LinkTabs
            data={linkTabsData.data}
            style={linkTabsData.style}
            selected={2}
          />
          <br />
          <TicketsTab></TicketsTab>
        </div>
      </section>
    </>
  );
};
export default TicketsPage;
