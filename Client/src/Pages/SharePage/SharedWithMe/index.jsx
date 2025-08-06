import { useEffect, useMemo, useState } from "react";
import { getSharedWithMeFiles } from "../../../Apis/shareApi";
import FileList from "./FileList";
import Header from "./Header";
import SearchAndFilter from "./SearchAndFilter";
import SharedWithMeShimmer from "../../../components/ShimmerUI/SharedWithMeShimmer";

export default function SharedWithMe() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sharedWithMeFiles, setSharedWithMeFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedWithMeFiles = async () => {
    setLoading(true);
    try {
      const res = await getSharedWithMeFiles();
      if (res.success) {
        setSharedWithMeFiles(res.data.sharedWithMe);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.error("Failed to fetch shared files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSharedWithMeFiles();
  }, []);

  const finalFilteredFiles = useMemo(() => {
    if (!sharedWithMeFiles) return [];
    return sharedWithMeFiles
      .filter((file) => {
        if (filter === "viewer") return file.permission === "viewer";
        if (filter === "editor") return file.permission === "editor";
        return true;
      })
      .filter(
        (file) =>
          file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.sharedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime()
      );
  }, [sharedWithMeFiles, searchTerm, filter]);


  const getFilterCount = (filterType) => {
    if (!sharedWithMeFiles) return 0;
    if (filterType === "all") return sharedWithMeFiles.length;
    return sharedWithMeFiles.filter((file) => file.permission === filterType)
      .length;
  };

  if (loading) {
    return (
     <SharedWithMeShimmer />
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <Header finalFilteredFiles={finalFilteredFiles}/>

          {/* Search and Filter */}
          <SearchAndFilter
            filter={filter}
            getFilterCount={getFilterCount}
            searchTerm={searchTerm}
            setFilter={setFilter}
            setSearchTerm={setSearchTerm}
          />

          {/* Files List */}
          <FileList
            filter={filter}
            finalFilteredFiles={finalFilteredFiles}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
}
