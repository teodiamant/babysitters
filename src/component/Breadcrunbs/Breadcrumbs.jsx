import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, Typography, Breadcrumbs as MuiBreadcrumbs } from "@mui/material";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const hiddenPaths = ["/", "/landing"]; // Προσάρμοσε ανάλογα

  if (hiddenPaths.includes(location.pathname)) {
    return null; // Δεν εμφανίζεται
  }
  if (location.pathname === "/home") {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MuiBreadcrumbs aria-label="breadcrumb">
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography color="primary">Home</Typography>
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography color="textPrimary" key={to}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </Typography>
          ) : (
            <Link
              key={to}
              to={to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography color="primary">
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Typography>
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;

