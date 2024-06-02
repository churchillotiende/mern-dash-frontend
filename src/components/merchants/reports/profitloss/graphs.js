function GraphsView() {
  return (
    <div>
      <div className="h-full w-full bg-white rounded-xl px-6 py-4 pb-8">
        <div className="flex justify-between items-center flex-wrap">
          <div className="flex w-full md:w-6/12 flex-wrap">
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit md:pr-2">
              <div className="text-dark text-sm">From</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                required=""
                placeholder="dd/mm/yyyy"
              />
            </div>
            <div className="flex flex-wrap space-y-1 w-full md:w-6/12 xl:w-fit">
              <div className="text-dark text-sm">To</div>
              <input
                type="date"
                name="search"
                className="input-primary h-12 text-grey-100"
                required=""
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="h-full w-full" x-show="tabShow=='summary'">
        <div className="h-full w-full mt-2 flex justify-between items-stretch flex-wrap">
          <div className="w-full md:w-9/12">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">
                Total Sales and Discounts
              </div>
              <div className="w-full h-full flex items-center">
                <div className="w-full flex justify-center ">
                  <div
                    id="canvas1"
                    className="relative w-full h-72 overflow-x-hidden"
                  >
                    <canvas
                      height={864}
                      width={882}
                      style={{
                        display: "block",
                        boxSizing: "border-box",
                        height: 288,
                        width: 294,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-3/12 md:pl-2">
            <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
              <div className="text-sm font-semibold">
                Transaction Payment Method
              </div>
              <div id="canvas2" className="overflow-x-hidden relative h-72">
                <canvas
                  height={864}
                  width={882}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: 288,
                    width: 294,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-full mt-2 flex justify-between items-stretch mb-8 flex-wrap">
          <div className="w-full md:w-12/12 mb-2">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">Invoices per Month</div>
              <div
                id="canvas3"
                className="w-full relative overflow-x-hidden h-72"
              >
                <canvas
                  height={864}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: 288,
                    width: 294,
                  }}
                  width={882}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-12/12">
            <div className="w-full bg-white px-6 py-4 pb-8 rounded-xl">
              <div className="text-sm font-semibold">Expenses per Month</div>
              <div
                id="canvas4"
                className="w-full relative overflow-x-hidden h-72"
              >
                <canvas
                  height={864}
                  style={{
                    display: "block",
                    boxSizing: "border-box",
                    height: 288,
                    width: 294,
                  }}
                  width={882}
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-6/12 md:pl-2 hidden">
            <div className="w-full bg-white  rounded-xl px-6 py-4 pb-8 mt-2 md:mt-0">
              <div className="text-sm font-semibold">Expenses Trends</div>
              <div id="canvas4" className="w-full overflow-x-hidden h-72" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GraphsView;
