// TransparentSidebar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../../slice/userSlice";
import "./Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // Start closed by default
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      // Don't auto-open on desktop, let user control it
    };

    // Set initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  // Close sidebar when clicking outside
  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  // Handle nav link clicks
  const handleNavLinkClick = () => {
    // Close sidebar when clicking nav links on all devices
    setIsOpen(false);
  };

  // Navigation items
  const navItems = [
    { path: "/", label: "Home", exact: true },
    { path: "/movies", label: "Movies" },
    { path: "/users", label: "Profile" },
    { path: "/favorites", label: "Favorites" },
  ];

  // Check if path is active
  const isActiveLink = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Get user initials
  const getUserInitials = (username) => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={closeMobileSidebar} />
      )}

      {/* Click outside overlay for desktop */}
      {!isMobile && isOpen && (
        <div className="sidebar-outside-click" onClick={handleOutsideClick} />
      )}

      {/* Animated Menu Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="menu-toggle"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: 0.2,
              },
            }}
            exit={{
              scale: 0,
              opacity: 0,
              transition: {
                duration: 0.3,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              transition: { duration: 0.1 },
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        className={`transparent-sidebar ${isOpen ? "open" : "collapsed"}`}
        initial={{ x: -240 }}
        animate={{
          x: isOpen ? 0 : -240,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
      >
        <div className="nav-container">
          {/* Navigation Menu */}
          <ul className="nav-menu">
            {navItems.map((item, index) => (
              <motion.li
                key={item.path}
                className="nav-item"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  transition: { delay: isOpen ? 0.1 + index * 0.05 : 0 },
                }}
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <Link
                    to={item.path}
                    className={`nav-link ${
                      isActiveLink(item.path, item.exact) ? "active" : ""
                    }`}
                    onClick={handleNavLinkClick}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        color: isActiveLink(item.path, item.exact)
                          ? "#f4c430"
                          : "rgba(255, 255, 255, 0.6)",
                      }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.li>
            ))}
          </ul>

          {/* User Section */}
          <motion.div
            className="user-section"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isOpen ? 1 : 0,
              transition: { delay: isOpen ? 0.3 : 0 },
            }}
          >
            <Link
              to="/users"
              className="user-info"
              onClick={handleNavLinkClick}
            >
              <div className="user-dot" />
              <span>{user?.Username || "User"}</span>
            </Link>
            <button className="logout-link" onClick={handleLogout}>
              Sign out
            </button>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
};

export default Sidebar;
