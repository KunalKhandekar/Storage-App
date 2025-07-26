export const mockApis = {
  getSharedWithMe: async (page = 1, limit = 10, filter = "all") => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: {
        files: [
          {
            _id: "1",
            name: "Marketing Strategy 2024.pdf",
            type: "pdf",
            size: "2.5 MB",
            sharedBy: {
              _id: "user1",
              name: "John Doe",
              email: "john@example.com",
              picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
            },
            permission: "viewer",
            sharedAt: "2024-01-15T10:30:00Z",
            lastModified: "2024-01-14T15:45:00Z",
          },
          {
            _id: "2",
            name: "Project Roadmap.xlsx",
            type: "excel",
            size: "1.8 MB",
            sharedBy: {
              _id: "user2",
              name: "Jane Smith",
              email: "jane@example.com",
              picture: "https://images.unsplash.com/photo-1494790108755-2616b612b5c7?w=32&h=32&fit=crop&crop=face",
            },
            permission: "editor",
            sharedAt: "2024-01-12T14:20:00Z",
            lastModified: "2024-01-13T09:15:00Z",
          },
          {
            _id: "3",
            name: "Design Assets.zip",
            type: "archive",
            size: "15.2 MB",
            sharedBy: {
              _id: "user3",
              name: "Mike Johnson",
              email: "mike@example.com",
              picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
            },
            permission: "viewer",
            sharedAt: "2024-01-10T11:45:00Z",
            lastModified: "2024-01-09T16:30:00Z",
          },
        ],
        pagination: {
          total: 3,
          page: 1,
          limit: 10,
          pages: 1,
        },
      },
    }
  },

  getSharedByMe: async (page = 1, limit = 10) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: {
        files: [
          {
            _id: "4",
            name: "Annual Report 2023.pdf",
            type: "pdf",
            size: "5.2 MB",
            sharedWith: [
              {
                user: {
                  _id: "user4",
                  name: "Alice Brown",
                  email: "alice@example.com",
                  picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                },
                permission: "viewer",
                sharedAt: "2024-01-14T08:30:00Z",
              },
              {
                user: {
                  _id: "user5",
                  name: "Bob Wilson",
                  email: "bob@example.com",
                  picture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face",
                },
                permission: "editor",
                sharedAt: "2024-01-13T12:15:00Z",
              },
            ],
            linkSharing: {
              enabled: true,
              permission: "viewer",
              link: "https://example.com/share/4",
            },
            createdAt: "2024-01-12T10:00:00Z",
            lastModified: "2024-01-14T16:20:00Z",
          },
          {
            _id: "5",
            name: "Team Guidelines.docx",
            type: "document",
            size: "890 KB",
            sharedWith: [
              {
                user: {
                  _id: "user6",
                  name: "Sarah Davis",
                  email: "sarah@example.com",
                  picture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
                },
                permission: "editor",
                sharedAt: "2024-01-11T14:45:00Z",
              },
            ],
            linkSharing: {
              enabled: true,
              permission: null,
              link: null,
            },
            createdAt: "2024-01-10T09:30:00Z",
            lastModified: "2024-01-11T15:00:00Z",
          },
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          pages: 1,
        },
      },
    }
  },

  updatePermission: async (fileId, userId, newPermission) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: { permission: newPermission },
    }
  },

  revokeAccess: async (fileId, userId) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
      success: true,
      data: { message: "Access revoked successfully" },
    }
  },

  viewFile: async (fileId) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      data: {
        url: `https://example.com/view/${fileId}`,
        canDownload: true,
      },
    }
  },
}
