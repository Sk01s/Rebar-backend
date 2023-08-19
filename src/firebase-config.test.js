import { processProducts, getProductPrice } from "./firebase-config";

// Mock the Firebase call
// jest.moke("firebase", () => {
//   return {
//     collection: (path) => {
//       return {
//         get: () => {
//           return Promise.resolve({
//             docs: [
//               {
//                 id: "1",
//                 data: () => ({
//                   category: { id: "cat1" },
//                   photos: ["img1", "img2"],
//                   title: "Product 1",
//                   price: "10.00",
//                 }),
//               },
//               {
//                 id: "2",
//                 data: () => ({
//                   category: { id: "cat2" },
//                   photos: ["img3", "img4"],
//                   title: "Product 2",
//                   price: "20.00",
//                 }),
//               },
//             ],
//           });
//         },
//       };
//     },
//   };
// });
describe("Product Service", () => {
  test("processProducts processes data correctly", () => {
    const mockProducts = {
      docs: [
        {
          id: "1",
          data: () => ({
            category: { id: "cat1" },
            photos: ["img1", "img2"],
            title: "Product 1",
            price: "10.00",
          }),
        },
        {
          id: "2",
          data: () => ({
            category: { id: "cat2" },
            photos: ["img3", "img4"],
            title: "Product 2",
            price: "20.00",
          }),
        },
      ],
    };

    const expectedCategories = {
      "cat1-1": {
        images: ["img1", "img2"],
        name: "Product 1",
        priceInCents: 1000,
      },
      "cat2-2": {
        images: ["img3", "img4"],
        name: "Product 2",
        priceInCents: 2000,
      },
    };

    expect(processProducts(mockProducts)).toEqual(expectedCategories);
  });

  // test("getProductPrice fetches and processes data correctly", async () => {
  //   const expectedCategories = {
  //     "cat1-1": {
  //       images: ["img1", "img2"],
  //       name: "Product 1",
  //       priceInCents: 1000,
  //     },
  //     "cat2-2": {
  //       images: ["img3", "img4"],
  //       name: "Product 2",
  //       priceInCents: 2000,
  //     },
  //   };

  //   const result = await getProductPrice();
  //   expect(result).toEqual(expectedCategories);
  // });
});
