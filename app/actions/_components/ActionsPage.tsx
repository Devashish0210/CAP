import CardLink from "@/app/actions/_components/card";
import DetailsCard from "./details-card";

const ActionsPage = () => {
  return (
    <>
      <section className="w-full">
        {/* <div className="w-[90%] mx-auto my-8">
                    <p>We are happy to have you here, please use the following options to proceed</p>
                </div> */}
        <div className="flex flex-col justify-evenly items-center w-full gap-3 mt-16 mb-10 mr-24 sm:flex-row sm:mb-0 sm:mr-0">
          <DetailsCard />
          <CardLink
            href="/documents"
            bodyText="Request a copy of your documents like PF Statement, Payslips, Relieving Letter, etc."
            headerText="Self-Service"
            className="bg-[#5591B7] text-background w-[15rem] h-[25rem] rounded-sm"
            icon="self-service.png"
          />
          <CardLink
            href="/faqs"
            bodyText="Read frequently asked questions after the exit process."
            headerText="FAQs"
            className="bg-[#3A577E] text-background w-[15rem] h-[25rem] rounded-sm"
            icon="faq.png"
          />
          <CardLink
            href="/tickets"
            bodyText="Raise a ticket with Admin, CIS, Finance and HR teams."
            headerText="Raise a Ticket"
            className="bg-[#003A69] text-background w-[15rem] h-[25rem] rounded-sm"
            icon="tickets.png"
          />
        </div>
      </section>
    </>
  );
};
export default ActionsPage;
