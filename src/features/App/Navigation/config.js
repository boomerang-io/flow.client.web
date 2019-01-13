export const navItems = location =>
  console.log(location.pathname) || [
    {
      path: {
        pathname: "/workflows",
        state: { fromUrl: location.pathname, fromText: location.pathname.split("/")[1] }
      },
      exact: false,
      text: "Workflows"
    },
    {
      path: {
        pathname: "/activity",
        state: { fromUrl: location.pathname, fromText: location.pathname.split("/")[1] }
      },
      exact: false,
      text: "Activity"
    },
    {
      path: {
        pathname: "/creator/overview",
        state: { fromUrl: location.pathname, fromText: location.pathname.split("/")[1] }
      },
      exact: false,
      text: "Creator"
    },
    {
      path: {
        pathname: "/insights",
        state: { fromUrl: location.pathname, fromText: location.pathname.split("/")[1] }
      },
      exact: false,
      text: "Insights"
    }
  ];
