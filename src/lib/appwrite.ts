"use server";
import { Client, Account, Databases, Query, Storage, ID } from "node-appwrite";
import { cookies } from "next/headers";

const applyDiscount = (price: number, discountPercentage: number) => {
  return Math.round(price - (price * (discountPercentage / 100)));
};

const capitalizeName = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);



export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

  const session = (await cookies()).get("appwrite-session");
  if (!session || !session.value) {
    // throw new Error("No session");
    return null
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    }
  };
}

export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
    .setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storages() {
      return new Storage(client);
    }
  };
}

export const createProduct = async (data: any) => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionid = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
  try {
    
    const response = await database.createDocument(
      databaseId,
      productCollectionid,
      ID.unique(),
      data,
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (id: string, updatedData: any) => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionid = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
  try {
    
    const response = await database.updateDocument(
      databaseId,
      productCollectionid,
      id,
      updatedData
    );
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (id: string,) => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionid = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
  try {
    
    const response = await database.deleteDocument(
      databaseId,
      productCollectionid,
      id,
    );
    return response;
  } catch (error) {
    throw error;
  }
};


export async function fetchProducts() {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionid = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(databaseId, productCollectionid);
    const products = response.documents;

    const productsWithDiscount = products.map(product => {
      const discountedPrice = applyDiscount(product.price, product.discountPercentage);

      return { ...product, discountedPrice, name: capitalizeName(product.name) };
    });
    return productsWithDiscount;

  } catch (error) {
    console.error("Error fetching product by ID: ", error);
    throw new Error("Failed to fetch product details.");
  }
}

export async function fetchCategories() {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const categoriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;

  const response = await database.listDocuments(databaseId, categoriesCollectionId);
  return response.documents;
}


export async function fetchCategory(data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const categoriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;
 const id = data.category;
  const response = await database.getDocument(
    databaseId, 
    categoriesCollectionId,
    id
  );
  return response;
}


export async function createCategory(data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const categoriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;
 const id = data.category;
  const response = await database.createDocument(
    databaseId, 
    categoriesCollectionId,
    ID.unique(),
    data
  );
  return response;
}

export async function updateCategory(id: string, data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const categoriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;
  const response = await database.updateDocument(
    databaseId, 
    categoriesCollectionId,
    id,
    data
  );
  return response;
}

export async function deleteCategory(id: string) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const categoriesCollectionId = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!;
  
  const response = await database.deleteDocument(
    databaseId, 
    categoriesCollectionId,
    id
  );
  return response;
}


export async function fetchProductById(productId: string) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionid = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

  try {
    const response = await database.getDocument(
      databaseId,
      productCollectionid,
      productId
    )

    const result = applyDiscount(response.price, response.discountPercentage);

    return { ...response, discountedPrice: result, name: capitalizeName(response.name) }
  } catch (error) {
    console.error("Error fetching product bt ID: ", error);
    throw new Error("Failed to fetch product details.");

  }
}

// export async function fetchProductsByIds(productIds: string[]): Promise<[]> {
//   const client = await createAdminClient();
//   const database = client.databases;

//   const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
//   const productCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;
//   try {
//     const response = await database.listDocuments(databaseId, productCollectionId, [
//       Query.equal("$id", productIds),
//     ]);

//     const products = response.documents.map((product) => {
//       const discountedPrice = applyDiscount(product.price, product.discountPercentage);
//       return {
//         ...product,
//         discountedPrice,
//         price: product.price,
//         name: capitalizeName(product.name),
//         imageUrl: product.imageUrl,
//       };
//     });
//     return products;
//   } catch (error) {
//     console.error("Error fetching products by IDs:", error);
//     throw new Error("Failed to fetch product details.");
//   }
// }

export async function fetchProductsByCategory(categoryId: string) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(
      databaseId,
      productCollectionId,
      [Query.equal("category", categoryId)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error("Failed to fetch products");
  }
};


export async function createMedicalDetails(data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const MedicalDetailsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_DETAILS_COLLECTION_ID!;

  try {
    const response = await database.createDocument(
      databaseId,
      MedicalDetailsCollectionId,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    console.error("Error creating medical details: ", error);
    throw new Error;
  }
}

export async function updateMedicalDetails(id: string, data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const MedicalDetailsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_DETAILS_COLLECTION_ID!;

  try {
    const response = await database.updateDocument(
      databaseId,
      MedicalDetailsCollectionId,
      id,
      data
    );

    return response;
  } catch (error) {
    console.error("Error updating medical details: ", error);
    throw new Error;
  }
}

export async function fetchMedicalDetails(productId: string) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const MedicalDetailsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_DETAILS_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(
      databaseId,
      MedicalDetailsCollectionId,
      [Query.equal("productId", productId)]
    );

    return response;
  } catch (error) {
    console.error("Error fetching medical details: ", error);
    throw new Error;
  }
}

export const deleteMedicalDetails = async (medicalId: string) => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const MedicalDetailsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_MEDICAL_DETAILS_COLLECTION_ID!;

  try {

    const response = await database.listDocuments(
      databaseId,
      MedicalDetailsCollectionId,
      [
        Query.search("productId",medicalId)
      ]
    );

    await database.deleteDocument(
      databaseId,
      MedicalDetailsCollectionId,
      response.documents[0].$id
    )


  } catch (error) {
    console.error("Error deleting medical details:", error);
    throw error;
  }
};

export async function searchProducts(query: string) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(
      databaseId,
      productCollectionId,
      [
        Query.search('name', query),
      ]
    );

    return response.documents;
  } catch (error) {
    console.error("Error searching products: ", error);
    throw new Error("Unknown error occurred during search.");
  }

}


export async function fetchCouponByCode(couponCode: string, originalPrice: number) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const couponsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_COUPONS_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(
      databaseId,
      couponsCollectionId,
      [Query.equal("code", couponCode)]
    );

    if (response.documents.length === 0) {
      throw new Error("Coupon code not found");
    }

    const coupon = response.documents[0];

    // Check if coupon is expired
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (expiryDate < currentDate) {
      throw new Error("Coupon code has expired");
    }

    // Check if coupon is active
    if (coupon.status !== "active") {
      throw new Error("Coupon code is inactive");
    }

    // Assuming coupon has a field like 'discountPercentage'
    const discountPercentage = coupon.discountPercentage || 0;
    const discountedPrice = applyDiscount(originalPrice, discountPercentage);

    return {
      coupon,
      discountedPrice,
    };
  } catch (error) {
    console.error("Error fetching coupon: ", error);
    throw new Error("Failed to validate coupon code");
  }
}

export const uploadImage = async (file: File) => {
  const client = await createAdminClient();
  const storage = client.storages;

  const productStorageId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_BUCKET!;

  try {
    const response = await storage.createFile(
      productStorageId,
      ID.unique(),
      file,
    );
    return response.$id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteImage = async (file: string) => {
  const client = await createAdminClient();
  const storage = client.storages;

  const productStorageId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCT_BUCKET!;

  try {
    await storage.deleteFile(
      productStorageId,
      file,
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const fetchProductsCount = async () => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const productCollectionid = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(databaseId, productCollectionid);
    const totalProducts = response.total;
    const inStockProducts = response.documents.filter((product: any) => product.inStock === true).length;
    return { total: totalProducts, inStock: inStockProducts };
  } catch (error) {
    return { total: 0, inStock: 0 };
  }
}

export const fetchUsersCount = async () => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const userCollectionid = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(databaseId, userCollectionid);
    return response.total;
  } catch (error) {
    return 0;
  }
}


export const fetchSubsCount = async () => {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const userCollectionid = process.env.NEXT_PUBLIC_APPWRITE_NEWSLETTER_COLLECTION_ID!;

  try {
    const response = await database.listDocuments(databaseId, userCollectionid);
    return response.total;
  } catch (error) {
    return 0;
  }
}

export async function fetchAnnouncement() {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const AnnouncementCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ANNOUNCEMENT_COLLECTION_ID!;
  try {
    const response = await database.listDocuments(
      databaseId,
      AnnouncementCollectionId,
    )

      return response
    
  } catch (error) {
    console.error("Error fetching announcement:", error);
    throw new Error("Failed to fetch announcement");
  }
}

export async function createAnnouncement(data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const AnnouncementCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ANNOUNCEMENT_COLLECTION_ID!;
  try {
    const response = await database.createDocument(
      databaseId,
      AnnouncementCollectionId,
      ID.unique(),
      data
    )
    return response
  } catch (error) {
    console.error("Error creating announcement:", error);
    throw new Error("Failed to create announcement");
  }
}

export async function updateAnnouncement(id: string, data: any) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const AnnouncementCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ANNOUNCEMENT_COLLECTION_ID!;
  try {
    const response = await database.updateDocument(
      databaseId,
      AnnouncementCollectionId,
      id,
      data
    )
    return response
  } catch (error) {
    console.error("Error updating announcement:", error);
    throw new Error("Failed to update announcement");
  }
}

export async function deleteAnnouncement(id: string) {
  const client = await createAdminClient();
  const database = client.databases;

  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const AnnouncementCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ANNOUNCEMENT_COLLECTION_ID!;
  try {
    const response = await database.deleteDocument(
      databaseId,
      AnnouncementCollectionId,
      id,
    )
    return response
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw new Error("Failed to delete announcement");
  }
}

export async function fetchBanners() {
  const client = await createAdminClient();
  const storage = client.storages;

  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BANNER_BUCKET_ID!;

  try {
    const response = await storage.listFiles(bucketId);

    const banners = response.files.map((file) => ({
      id: file.$id,
      name: file.name,
      url: `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${bucketId}/files/${file.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`
    }))
    return banners;
  } catch (error) {
    console.error('Error fetching banners: ', error);
    throw new Error('Unknown error occured while fetching banners.');
  }
}

export const uploadBanner = async (file: File) => {
  const client = await createAdminClient();
  const storage = client.storages;

  const productStorageId = process.env.NEXT_PUBLIC_APPWRITE_BANNER_BUCKET_ID!;

  try {
    const response = await storage.createFile(
      productStorageId,
      ID.unique(),
      file,
    );
    return response.$id;
  } catch (error) {
    console.error("Error uploading banner:", error);
    throw error;
  }
};

export const deleteBanner = async (file: string) => {
  const client = await createAdminClient();
  const storage = client.storages;

  const productStorageId = process.env.NEXT_PUBLIC_APPWRITE_BANNER_BUCKET_ID!;

  try {
    await storage.deleteFile(
      productStorageId,
      file,
    );
  } catch (error) {
    console.error("Error uploading banner:", error);
    throw error;
  }
};


export async function fetchUsers() {
  const client = await createAdminClient();
  const database = client.databases;

    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
    const userCollectionid = process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!;
  
    try {
      const response = await database.listDocuments(databaseId, userCollectionid);
      return response.documents;
    } 
   catch (error) {
    console.error("Error fetching users");
    throw new Error("Failed to fetch users.");
  }
}
