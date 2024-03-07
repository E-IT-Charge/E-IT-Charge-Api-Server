import { Box, CircularProgress, Fab, Tooltip } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { HttpGet } from "../../services/HttpService";
import ChargingStationSearchBar from "./ChargingStationSearchBar";
import ChargingStationSearchMap from "./ChargingStationSearchMap";
import ChargingStationSearchSwitch from "./ChargingStationSearchSwitch";

const ChargingStationSearch = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [myLoc, setMyLoc] = useState(null);
  const [temporaryArray, setTemporaryArray] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [mapLoc, setMapLoc] = useState({});
  const [check, setCheck] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }

    function success(position) {
      setMyLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setMapLoc({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    }

    function error() {
      setMyLoc({
        lat: 37.5665,
        lng: 126.9784,
      });
      setMapLoc({
        lat: 37.5665,
        lng: 126.9784,
      });
    }
    setCheck(true);
  }, []);

  // 토글 아웃 시 충전소 지도로 이동 (0.5초 이후)
  // useEffect(() => {
  //   if (!showSearchBar) {
  //     const timer = setTimeout(() => {
  //       navigate("/map");
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }
  // }, [showSearchBar]);

  useEffect(() => {
    if (searchResult) {
      setTemporaryArray(searchResult);
      setLoading(false);
    }
  }, [searchResult]);

  const fetchSearchResult = async (searchParam) => {
    try {
      setLoading(true);
      const response = await HttpGet(
        "/api/v1/chargingStation/searchBaseDistance",
        {
          ...searchParam,
          ...mapLoc,
        }
      );
      setSearchResult(response);
    } catch (error) {
      console.error("검색 결과 로딩 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapMove = (lat, lng) => {
    setMapCenter({ lat, lng });
  };

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const handleSwtichChange = (checked) => {
    setSwitchChecked(checked);
  };

  return (
    <Box style={{ overflow: "hidden" }}>
      <ChargingStationSearchSwitch
        checked={switchChecked}
        onChange={handleSwtichChange}
      />
      <Tooltip title="검색 창 열기 / 닫기" placement="right-end">
        <Fab
          color="primary"
          aria-label="search"
          style={{
            bottom: "5%",
            left: "10px",
            position: "fixed",
            zIndex: 9999,
          }}
          onClick={toggleSearchBar}
        >
          <Search />
        </Fab>
      </Tooltip>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {loading && (
          <CircularProgress
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 9999,
            }}
          />
        )}
        <Box sx={{ zIndex: 2, position: "fixed" }}>
          <ChargingStationSearchBar
            onSearch={fetchSearchResult}
            searchResult={searchResult}
            setSearchResult={setSearchResult}
            onMapMove={handleMapMove}
            showSearchBar={showSearchBar}
            mapLoc={mapLoc}
            check={check}
          />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            zIndex: 1,
          }}
        >
          <ChargingStationSearchMap
            temporaryArray={temporaryArray}
            myLoc={myLoc}
            propsMapCenter={mapCenter}
            setMapLoc={setMapLoc}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChargingStationSearch;
