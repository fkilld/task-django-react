import React, { useState } from "react";
import "./Sidebar.css"; // Ensure to create this CSS file for styling

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="scroll-sidebar-div">
            <div className="hide-show-container">
                <div className="sidepanel-container">
                    <div className="sidenav">
                        <div className="sidepanel-container">
                            <div style={{ fontSize: "13px" }}>Select An Action</div>
                        </div>

                        {/* Dropdown Button */}
                        <button
                            className="dropdown-btn"
                            onClick={toggleDropdown}
                        >
                            <div style={{ fontSize: "13px" }}>Open Source Satellite Datasets</div>
                            <div>
                                <i
                                    className={`fa fa-caret-${isOpen ? "up" : "down"}`}
                                    style={{ marginLeft: "5px" }}
                                    aria-hidden="true"
                                ></i>
                            </div>
                        </button>

                        {/* Dropdown Content */}
                        {isOpen && (
                            <div className="hidden-container">
                                <div className="dropdown-div" value="173">Open Source Satellite Datasets<hr /></div>
                                <div className="dropdown-div" value="182">Derived Open Source Satellite Datasets<hr /></div>
                                <div className="dropdown-div" value="210">Automated Actions<hr /></div>
                                <div className="dropdown-div" value="228">High Resolution Data Catalogue<hr /></div>
                                <div className="dropdown-div" value="232">SRA<hr /></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
