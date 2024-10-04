import {redirect, RedirectType} from "next/navigation";

const Home = async () => {
    return redirect(
        '/shop',
        RedirectType.replace
    );
};
export default Home;
