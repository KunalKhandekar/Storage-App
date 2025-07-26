
import {
  ArrowLeft,
  Clock,
  Eye,
  Globe,
  Search,
  Settings,
  Share2,
  Shield,
  Users
} from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSharedByMeFiles } from "../../Apis/shareApi"
import { FileIcon, formatTime, PermissionBadge, UserAvatar } from "../../Utils/helpers"


export default function SharedByMe() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [sharedByMeFiles, setSharedByMeFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSharedByMeFiles = async () => {
    setLoading(true)
    try {
      const res = await getSharedByMeFiles()
      if (res.success) {
        setSharedByMeFiles(res.data.sharedByMeFiles)
      } else {
        console.log(res.message)
      }
    } catch (error) {
      console.error("Failed to fetch shared files:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSharedByMeFiles()
  }, [])

  const handleViewFile = (file) => {
    navigate(`/share/view/${file._id}`, { state: {file, route: `/file/${file._id}`} })
  }

  const handleManagePermissions = (file) => {
    navigate(`/share/manage/${file._id}`)
  }

  const filteredFiles = sharedByMeFiles
    ?.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime())

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-64"></div>
              </div>
            </div>
            <div className="h-10 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Header */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={() => navigate("/share")}
                className="group p-2 sm:p-2.5 hover:bg-white hover:shadow-md rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900" />
              </button>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Shared By Me
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1 truncate">
                  Files you've shared with others
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs sm:text-sm text-gray-500">
              <Share2 size={14} className="sm:w-4 sm:h-4" />
              <span className="whitespace-nowrap">{filteredFiles?.length || 0} files shared</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          {/* Files List */}
          <div className="space-y-3 sm:space-y-4">
            {filteredFiles?.length === 0 ? (
              <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Users size={32} className="sm:w-10 sm:h-10 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">No shared files found</h3>
                <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  {searchTerm
                    ? `No files match "${searchTerm}". Try a different search term.`
                    : "Files you share with others will appear here with sharing details."}
                </p>
              </div>
            ) : (
              filteredFiles?.map((file) => (
                <div
                  key={file._id}
                  className="group bg-white border border-gray-200 rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-4">
                      {/* File Info */}
                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                          <FileIcon type={file.type} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3
                              className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight"
                              title={file.name}
                            >
                              {file.name}
                            </h3>
                            {file.isSharedViaLink && (
                              <div className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                                <Globe size={10} />
                                <span className="hidden xs:inline">Public</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <span className="font-medium">{file.size}</span>
                            {file.sharedWith.length > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Users size={12} />
                                  {file.sharedWith.length}
                                </span>
                              </>
                            )}
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTime(file.latestTime)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleManagePermissions(file)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <Settings size={16} />
                          <span>Manage</span>
                        </button>
                        <button
                          onClick={() => handleViewFile(file)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:block">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-200">
                            <FileIcon type={file.fileType} size={24} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3
                                className="text-base lg:text-lg font-semibold text-gray-900 truncate"
                                title={file.name}
                              >
                                {file.name}
                              </h3>
                              {file.isSharedViaLink && (
                                <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                                  <Globe size={12} />
                                  <span>Public link</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium">{file.size}</span>
                              <span>•</span>
                              {file.sharedWith.length > 0 && (
                                <>
                                  <span className="flex items-center gap-1">
                                    <Users size={14} />
                                    {file.sharedWith.length} {file.sharedWith.length === 1 ? "person" : "people"}
                                  </span>
                                  <span>•</span>
                                </>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                Modified {formatTime(file.latestTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleManagePermissions(file)}
                            className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200"
                          >
                            <Settings size={16} />
                            <span className="hidden md:inline">Manage</span>
                          </button>
                          <button
                            onClick={() => handleViewFile(file)}
                            className="flex items-center gap-2 px-3 lg:px-4 py-2 text-sm font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          >
                            <Eye size={16} />
                            <span className="hidden md:inline">View</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Shared Users Preview */}
                    {file.sharedWith.length > 0 && (
                      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-gray-700">Shared with:</span>
                          {file.sharedWith.length > 3 && (
                            <span className="text-xs text-gray-500">+{file.sharedWith.length - 3} more</span>
                          )}
                        </div>

                        {/* Mobile Shared Users */}
                        <div className="block sm:hidden space-y-2">
                          {file.sharedWith.slice(0, 2).map((share) => (
                            <div
                              key={share.user._id}
                              className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                            >
                              <UserAvatar user={share.user} size="w-7 h-7" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{share.user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{share.user.email}</p>
                              </div>
                              <PermissionBadge permission={share.permission} />
                            </div>
                          ))}
                          {file.sharedWith.length > 2 && (
                            <div className="text-center py-2">
                              <span className="text-xs text-gray-500">+{file.sharedWith.length - 2} more people</span>
                            </div>
                          )}
                        </div>

                        {/* Desktop Shared Users */}
                        <div className="hidden sm:flex sm:flex-wrap gap-3">
                          {file.sharedWith.slice(0, 3).map((share) => (
                            <div
                              key={share.user._id}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 min-w-0"
                            >
                              <UserAvatar user={share.user} size="w-8 h-8" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{share.user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{share.user.email}</p>
                              </div>
                              <PermissionBadge permission={share.permission} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
