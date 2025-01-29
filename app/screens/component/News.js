import React from "react";

function News() {
  const dataArtikel = [
    {
      id: "1",
      judul: "PENGOLAHAN LIMBAH KOTORAN SAPI MENJADI PUPUK ORGANIK",
      deskripsi:
        "Hasil sampingan pemeliharaan ternak sapi atau sering juga disebut sebagai kotoran sapi tersusun dari feses, urine dan sisa pakan yang diberikan (terutama untuk ternak yang dikandangkan). Hasil sampingan ini merupakan bahan utama pembuatan kompos yang sangat balk dan cukup berpotensi untuk dijadikan pupuk organik serta memiliki nilai hara yang cukup baik",
      menu: "sulap_limbah",
      user: {
        id: "1",
        fullname: "Fatkhurrohman Purnomo",
        no_wa: "625858585858",
      },
      media: [
        {
          id: "1",
          link: "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      created: "2023-12-28T14:18:05.000Z",
      updated: "2023-12-28T14:18:05.000Z",
    },
    {
      id: "2",
      judul: "Guru Besar UGM tekankan deteksi dini penyakit IBR pada sapi",
      deskripsi:
        "Guru Besar bidang Mikrobiologi, Fakultas Kedokteran Hewan Universitas Gadjah Mada (UGM) Tri Untari menekankan penting deteksi dini penyakit infectious bovine rhinotracheitis (IBR) sebagai salah satu penyakit hewan menular yang mengancam peternakan sapi di Indonesia",
      menu: "sulap_limbah",
      user: {
        id: "1",
        fullname: "Fatkhurrohman Purnomo",
        no_wa: "625858585858",
      },
      media: [
        {
          id: "1",
          link: "https://images.unsplash.com/photo-1530268782463-418534b0affa?q=80&w=1774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ],
      created: "2023-12-28T14:18:05.000Z",
      updated: "2023-12-28T14:18:05.000Z",
    },
  ];
  return (
    <View style={[GlobalStyle.paddingdefault]}>
      <View style={[GlobalStyle.Artikel]}>
        <Image
          style={[GlobalStyle.ArtikelImage]}
          source={{ uri: dataArtikel[0].media[0].link }}
        ></Image>
        <View style={GlobalStyle.overlay}>
          <Text style={GlobalStyle.overlayText}>{dataArtikel[0].judul}</Text>
          <Text style={GlobalStyle.overlayDescription}>
            {dataArtikel[0].deskripsi.length > 40
              ? `${dataArtikel[0].deskripsi.substring(0, 40)}...`
              : dataArtikel[0].deskripsi}
          </Text>
          <TouchableOpacity>
            <Text style={GlobalStyle.readMoreText}>Baca Selengkapnya</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default News;
