import React from "react";
import Contact from "./Contact";
import OverviewDetail from "./Overview";
const meta = require("./metadata.json");

const DataDrivenDisplay = (props) => {
  const { data, onScroll } = props;

  const catList = meta.reduce((list, item) => list.includes(item.category) ? list : [...list, item.category], []);

  return (
    <div className="detailMain" onScroll={onScroll}>
      <OverviewDetail data={data} />
      <Contact data={data} />
      {catList.map((categoryName) => (
        <div className="detailItem" key={categoryName}>
          <div className="itemOne">
            <div className="itemTitle">{categoryName}</div>
            <div className="mb1">
              {data[categoryName] &&
              meta.filter(item => item.category === categoryName)
              .reduce((acc, curr) => acc.includes([curr.unifiedName, curr.longName]) ? acc : [...acc, [curr.unifiedName, curr.longName]], [])
              .map((item, index) => {
                return data[categoryName][item[0]] && (
                  <div key={index}>
                    <span
                      className="w50"
                      style={{ overflowWrap: "break-word" }}
                    >
                      {item[1]}
                    </span>
                    :{" "}
                    <span
                      className="font500"
                      style={{ overflowWrap: "break-word" }}
                    >
                      {data[categoryName][item[0]]}
                    </span>
                  </div>
                );
                })}
            </div>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};
export default DataDrivenDisplay;
