"use client"

import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Edit3,
  Eye,
  Filter,
  Search,
  Share2,
  Shield,
  Users
} from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSharedWithMeFiles } from "../../Apis/shareApi"
import { FileIcon, formatTime, PermissionBadge, UserAvatar } from "../../Utils/helpers"

export default function SharedWithMe() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sharedWithMeFiles, setSharedWithMeFiles] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSharedWithMeFiles = async () => {
    setLoading(true)
    try {
      const res = await getSharedWithMeFiles()
      if (res.success) {
        setSharedWithMeFiles(res.data.sharedWithMe)
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
    fetchSharedWithMeFiles()
  }, [])

  const finalFilteredFiles = useMemo(() => {
    if (!sharedWithMeFiles) return []
    return sharedWithMeFiles
      .filter((file) => {
        if (filter === "viewer") return file.permission === "viewer"
        if (filter === "editor") return file.permission === "editor"
        return true
      })
      .filter(
        (file) =>
          file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          file.sharedBy.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => new Date(b.latestTime).getTime() - new Date(a.latestTime).getTime())
  }, [sharedWithMeFiles, searchTerm, filter])

  const handleViewFile = (file) => {
    navigate(`/share/view/${file._id}`, { state: { file } })
  }

  const getFilterCount = (filterType) => {
    if (!sharedWithMeFiles) return 0
    if (filterType === "all") return sharedWithMeFiles.length
    return sharedWithMeFiles.filter((file) => file.permission === filterType).length
  }

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
            <div className="flex gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              <div className="w-32 h-10 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Enhanced Header */}
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <button
                  onClick={() => navigate("/share")}
                  className="group p-2 sm:p-2.5 hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <ArrowLeft size={16} className="sm:w-5 sm:h-5 text-gray-600 group-hover:text-gray-900" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users size={18} className="text-blue-600" />
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                      Files Shared with Me
                    </h1>
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm mt-0.5 sm:mt-1 truncate ml-11">
                    Access files others have shared with you
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs sm:text-sm font-medium">
                  <Share2 size={14} />
                  <span>{finalFilteredFiles?.length || 0} files</span>
                </div>
                <div className="text-xs text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <Search
                size={16}
                className="sm:w-4 sm:h-4 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search files or people..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm placeholder:text-gray-400"
              />
            </div>
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto px-4 py-2.5 sm:py-3 pr-10 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200 text-sm font-medium text-gray-700"
              >
                <option value="all">All Files ({getFilterCount("all")})</option>
                <option value="viewer">View Only ({getFilterCount("viewer")})</option>
                <option value="editor">Can Edit ({getFilterCount("editor")})</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Filter Pills - Mobile */}
          <div className="flex sm:hidden gap-2 overflow-x-auto pb-2">
            {["all", "viewer", "editor"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                  filter === filterType
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Filter size={10} />
                {filterType === "all" ? "All" : filterType === "viewer" ? "View Only" : "Can Edit"}
                <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs">
                  {getFilterCount(filterType)}
                </span>
              </button>
            ))}
          </div>

          {/* Files List */}
          <div className="space-y-3 sm:space-y-4">
            {finalFilteredFiles.length === 0 ? (
              <div className="text-center py-12 sm:py-16 lg:py-20 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Users size={28} className="sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 sm:mb-3">
                  {searchTerm || filter !== "all" ? "No files found" : "No files shared with you"}
                </h3>
                <p className="text-gray-500 max-w-sm sm:max-w-md mx-auto text-xs sm:text-sm leading-relaxed">
                  {searchTerm
                    ? `No files match "${searchTerm}". Try a different search term.`
                    : filter !== "all"
                      ? `No files with ${filter === "viewer" ? "view only" : "edit"} permissions found.`
                      : "When someone shares a file with you, it will appear here."}
                </p>
              </div>
            ) : (
              finalFilteredFiles.map((file) => (
                <div
                  key={file._id}
                  className="group bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-blue-100/50 hover:bg-white transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    {/* Mobile Layout */}
                    <div className="block sm:hidden space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-200">
                          <FileIcon type={file.fileType} size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3
                              className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight"
                              title={file.name}
                            >
                              {file.name}
                            </h3>
                            <PermissionBadge permission={file.permission} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                            <span>Shared by {file.sharedBy.name}</span>
                            <span>•</span>
                            <span className="font-medium">{file.size}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {formatTime(file.latestTime)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <UserAvatar user={file.sharedBy} size="w-6 h-6" />
                              <span className="text-xs text-gray-600 truncate">{file.sharedBy.name}</span>
                            </div>
                            <button
                              onClick={() => handleViewFile(file)}
                              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                            >
                              {file.permission === "editor" ? (
                                <>
                                  <Edit3 size={12} />
                                  <span>Edit</span>
                                </>
                              ) : (
                                <>
                                  <Eye size={12} />
                                  <span>View</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors duration-200">
                          <FileIcon type={file.fileType} size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-sm lg:text-base font-medium text-gray-900 truncate" title={file.name}>
                              {file.name}
                            </h3>
                            <PermissionBadge permission={file.permission} />
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Shared by {file.sharedBy.name}</span>
                            <span>•</span>
                            <span className="font-medium">{file.size}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTime(file.latestTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <UserAvatar user={file.sharedBy} size="w-8 h-8" />
                        <button
                          onClick={() => handleViewFile(file)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                        >
                          {file.permission === "editor" ? (
                            <>
                              <Edit3 size={14} />
                              <span className="hidden md:inline">Edit</span>
                            </>
                          ) : (
                            <>
                              <Eye size={14} />
                              <span className="hidden md:inline">View</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
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