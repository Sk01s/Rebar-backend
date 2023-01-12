require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getFirestore, getDocs, collection } = require("firebase/firestore");

const app = initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PRODUCT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDERID,
  appId: process.env.REACT_APP_APPID,
});

const db = getFirestore(app);

async function setPurchase(id) {
  const user = await getDoc(doc(db, "", id));
}

async function getProductPrice() {
  const products = await getDocs(collection(db, "products"));
  const categories = {};
  products.docs.forEach((product) => {
    const productData = product.data();
    categories[`${productData.category.id}-${product.id}`] = {
      images: productData.photos,
      name: productData.title,
      priceInCent: parseFloat(productData.price) * 100,
    };
  });
  return categories;
}

module.exports = {
  getProductPrice,
};
