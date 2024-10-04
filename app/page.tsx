export async function getServerSideProps() {
    return {
        redirect: {
            destination: '/shop',
            permanent: false,
        },
    };
}

const Home = () => null;
export default Home;
