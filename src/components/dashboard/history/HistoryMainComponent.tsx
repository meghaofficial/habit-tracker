import Card from "../../shared/Card";

const HistoryMainComponent = () => {
  return (
    <>
      <div className="my-3">
        <Card heading="" cardWidth="w-full" bodyHeight="h-screen">
          <div className="flex items-center justify-center mt-3 overflow-y-auto">
            <div className="flex flex-col items-center justify-center py-20 px-1">
              <div className="text-5xl mb-4">🚀</div>
              <h2 className="text-2xl font-bold google-sans">Coming Soon</h2>
              <p className="mt-3 text-center text-gray-500 max-w-md text-[14px]">
                We're working on something exciting. This feature will be
                available in the next few days.
              </p>
            </div>
          </div>
        </Card>
      </div>
      {/* <div className="flex items-start mt-4 mb-3 gap-3">
        <Card
          heading="Select Month"
          cardWidth="w-1/4"
          bodyHeight="h-[702px]"
        >
          <div className="flex items-center justify-center mt-3 overflow-y-auto"></div>
        </Card>
        <div className="w-3/4">
          <Card heading="" cardWidth="w-full">
            <div className="flex items-center justify-between"></div>
          </Card>
          <Card heading="" cardWidth="w-full" styling="mt-3">
            <div className="relative w-full px-1.5"></div>
          </Card>
        </div>
      </div> */}
    </>
  );
};

export default HistoryMainComponent;
