
const { adminFirestore } = require("./firebase/firebaseAdmin");

async function listCategories() {
  try {
    const snapshot = await adminFirestore.collection("categories").get();
    const categories = snapshot.docs.map(doc => doc.data().name);
    console.log("Categories:", categories);
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

listCategories();
