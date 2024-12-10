const crypto = require("crypto");
const storeData = require("./storeData");
const { Firestore } = require("@google-cloud/firestore");
const { console } = require("inspector");

async function postPredictHandler(request, h) {
  try {
    // Mengambil input dari user melalui payload
    const result = request.payload;

    // Validasi jika data tidak lengkap
    if (!result) {
      return h.response({ message: "Data kosong" }).code(400);
    }

    // Buat ID unik dan timestamp
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Format data yang akan disimpan
    const data = {
      id,
      result,
      createdAt,
    };

    // Simpan data ke Firestore
    await storeData(id, data);

    // Berikan respons sukses
    return h.response({ message: "Data berhasil disimpan", data }).code(201);
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    return h.response({ message: "Terjadi kesalahan", error: error.message }).code(500);
  }
}

async function getHistory(request, h) {
  try {
    const db = new Firestore();
    const predictRef = await db.collection("predictions").get();
    const predictData = [];
    predictRef.forEach((doc) => {
      const dataPredict = doc.data();
      predictData.push({
        id: doc.id,
        history: {
          result: dataPredict.result,
          createdAt: dataPredict.createdAt,
          id: dataPredict.id,
        },
      });
    });

    const response = h.response({
      status: "success",
      data: predictData,
    });
    response.code(200);
    return response;
  } catch (err) {
    console.log("Error fetching proggress:", err);
    const response = h.response({
      status: "error",
      message: "Terjadi Kesalahan saat mengambil data predicts",
    });
    response.code(500);
    return response;
  }
}

module.exports = { postPredictHandler, getHistory };
