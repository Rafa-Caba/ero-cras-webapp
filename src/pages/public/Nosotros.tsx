import NosotrosSection from "../../components-public/NosotrosSection"
import SidebarLeft from "../../components-public/SidebarLeft"
import SidebarRight from "../../components-public/SidebarRight"

const NosotrosPage = () => {
    return (
        <main className="main row d-flex">
            <SidebarLeft />
            <section className="center col-12 col-md-8 d-flex flex-column align-items-center order-0 order-md-1">
                <NosotrosSection />
            </section>
            <SidebarRight />
        </main>
    )
}

export default NosotrosPage