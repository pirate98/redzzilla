import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import GoogleMap from "../components/GoogleMap";
import Login from "../components/Login";
import { useSearchService } from "../services/SearchService";
import { useSession } from "../contexts/SessionContext";
import SearchForm from "../components/SearchForm";
import SaveSearch from "../components/SaveSearch";
import Constant from "../Constant";
import { useWindowSize } from "../hooks/useWindowSize";
import reverse from "reverse-geocode";

const checkFile = () => {
  try {
    return require("../components/Filters");
  } catch (err) {
    return null;
  }
};

const Filters = checkFile() ? checkFile().default : null;

function Home() {
  const { state } = useLocation();
  const [{ user }] = useSession();
  const { width } = useWindowSize();

  const [currentLocation, setCurrentLocation] = useState({
    lat: 32.727,
    lng: 117.1647,
  });
  const [userZip, setUserZip] = useState(0);
  const [filterStatus, setFilterStatus] = useState({
    keywords: "92101",
    availableOnly: 1,
    forSaleTypes: [...Constant.initForSaleTypes],
    propertyType: [...Constant.initPropertyType],
    otherAmenities: [],
    viewTypes: [],
    per_page: 200,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(pos);
        },
        () => {
          alert("Geo Location not supported");
        }
      );
    }
  }, []);

  useEffect(() => {
    let zipcode = reverse.lookup(
      currentLocation.lat,
      currentLocation.lng,
      "us"
    ).zipcode;
    setUserZip(zipcode);
  }, [currentLocation]);

  useEffect(() => {
    if (typeof state?.searchIndex !== "undefined") {
      setFilterStatus(user?.savedSearch[state.searchIndex]);
    }
  }, [state?.searchIndex, user?.savedSearch]);

  const data = useSearchService(filterStatus);

  return (
    <div className="App">
      <div className="fillterAndSignIn">
        <div className="filterContainer">
          <div className="searchInputLogin">
            <SearchForm
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              userZip={userZip}
            />
            {width < 770 && <Login />}
          </div>

          <div className="filterSearch">
            {Filters && (
              <Filters
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            )}

            <SaveSearch
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />
          </div>
        </div>
        {width >= 770 && <Login />}
      </div>

      {filterStatus.keywords && data && (
        <Fragment>
          <div style={{ height: "100vh", width: "100%" }}>
            <GoogleMap
              initialData={data}
              filterStatus={filterStatus}
              currentLocation={currentLocation}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
}

export default Home;
