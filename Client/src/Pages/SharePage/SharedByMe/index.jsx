import { useEffect, useState } from "react";
import { getSharedByMeFiles } from "../../../Apis/shareApi";
import FileList from "./FileList";
import Header from "./Header";
import SearchBar from "./SearchBar";
import SharedByMeShimmer from "../../../components/ShimmerUI/SharedByMeShimmer";

export default function SharedByMe() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sharedByMeFiles, setSharedByMeFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSharedByMeFiles = async () => {
    setLoading(true);
    try {
      const res = await getSharedByMeFiles();
      if (res.success) {
        setSharedByMeFiles(res.data.sharedByMeFiles);
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
    fetchSharedByMeFiles();
  }, []);

  const filteredFiles = sharedByMeFiles
    ?.filter((file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(
      (a, b) =>
        new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime()
    );

  if (loading) {
    return <SharedByMeShimmer />;
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <Header filteredFiles={filteredFiles} />

          {/* Search */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Files List */}
          <FileList filteredFiles={filteredFiles} searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
