


const defaultItem = { title: 'Dashboard', icon: <i className="bi bi-menu-button-wide mx-2"></i> };

const SidebarItems = {
    PRODUCER: {
        items: [
            {
                ...defaultItem,
                link: ""
            },
            {
                title: "New Application",
                icon: <i className="bi bi-file-earmark-plus-fill mx-2"></i>,
                link: ""
            },
            {
                title: "My applications",
                icon: <i className="bi bi-archive-fill mx-2"></i>,
                link: ""
            }
        ]
    },
    RAB: {
        items: [
            {
                ...defaultItem,
                link: ""
            },
            {
                title: "Review Applications",
                icon: <i class="bi bi-binoculars-fill mx-2"></i>,
                link: ""
            },
        ]
    },
    RSB: {
        items: [
            {
                ...defaultItem,
                link: ""
            },
            {
                title: "Review Applications",
                icon: <i class="bi bi-binoculars-fill mx-2"></i>,
                link: ""
            },
        ]
    }, 
    RICA: {
        items: [
            {
                ...defaultItem,
                link: ""
            },
            {
                title: "Review Applications",
                icon: <i class="bi bi-binoculars-fill mx-2"></i>,
                link: ""
            },
        ]
    }

}

const getSidebarItems=(role)=>{
    return SidebarItems[role].items || []
}

export default getSidebarItems;