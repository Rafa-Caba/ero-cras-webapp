import { CantosMisaSection } from "../../components-public/CantosMisaSection"
import SidebarLeft from "../../components-public/SidebarLeft"
import SidebarRight from "../../components-public/SidebarRight"

const MisaErocrasPage = () => {
    return (
        <main className="main row d-flex">
            <SidebarLeft />
            <section className="center col-12 col-md-8 d-flex flex-column align-items-center order-0 order-md-1 h-100">
                <CantosMisaSection />
            </section>
            <SidebarRight />
        </main>
    )
}

export default MisaErocrasPage