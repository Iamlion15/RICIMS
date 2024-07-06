


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
            },
            {
                title: "Comments",
                icon: <i className="bi bi-chat-right-quote-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Pending payments",
                icon: <i className="bi bi-bar-chart-line-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Payment history",
                icon:  <i className="bi bi-clock-history mx-2"></i>,
                link: ""
            },
            {
                title: "Your Licences",
                icon:  <i className="bi bi-card-checklist mx-2"></i>,
                link: ""
            },
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
            {
                title: "Comments",
                icon: <i class="bi bi-chat-right-quote-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Detailed reports",
                icon: <i class="bi bi-bar-chart-line-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Approved documents",
                icon: <i class="bi bi-calendar2-check-fill mx-2"></i>,
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
            {
                title: "Comments",
                icon: <i class="bi bi-chat-right-quote-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Detailed reports",
                icon: <i class="bi bi-bar-chart-line-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Approved documents",
                icon: <i class="bi bi-calendar2-check-fill mx-2"></i>,
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
            {
                title: "Comments",
                icon: <i class="bi bi-chat-right-quote-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Detailed reports",
                icon: <i class="bi bi-bar-chart-line-fill mx-2"></i>,
                link: ""
            },
            {
                title: "Approved documents",
                icon: <i class="bi bi-calendar2-check-fill mx-2"></i>,
                link: ""
            },
        ]
    }

}

const getSidebarItems = (role) => {
    return SidebarItems[role].items || []
}

export default getSidebarItems;