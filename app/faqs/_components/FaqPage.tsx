import FaqTab2 from "./FaqTab/FaqTab2";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "@/app/_components/link-tabs-data";

const Faq = () => {
  return (
    <>
      <section className="mb-10">
        <LinkTabs
          data={linkTabsData.data}
          style={linkTabsData.style}
          selected={1}
        />
        <div
          style={{
            margin: "auto",
            display: "flex",
            width: "100%",
            alignContent: "center",
            marginTop: "2vh",
          }}
        >
          <FaqTab2 />
        </div>
      </section>
    </>
  );
};
export default Faq;
