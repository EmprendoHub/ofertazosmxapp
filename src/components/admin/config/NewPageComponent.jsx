"use client";
import React, { useRef, useState } from "react";
import AnimationWrapper from "@/components/motions/AnimationWrapper";
import Image from "next/image";
import { motion } from "framer-motion";
import { cstDateTimeClient } from "@/backend/helpers";
import { addNewPage, updatePage } from "@/app/_actions";
import { useRouter } from "next/navigation";

const NewAboutPageComponent = ({ acerca }) => {
  const router = useRouter();
  const formRef = useRef();
  // Main section
  const [mainTitle, setMainTitle] = useState(acerca?.mainTitle || "");
  const [mainImage, setMainImage] = useState(
    acerca?.mainImage || "/images/shopout_about_us_cover.jpg"
  );
  const [preTitle, setPreTitle] = useState(acerca?.preTitle);
  const [subTitle, setSubTitle] = useState(acerca?.subTitle);
  // section 2
  const [sectionTwoColOneImage, setSectionTwoColOneImage] = useState(
    acerca?.sections[1].boxes[1].images[0].url ||
      "/images/shopout_about_us_cover.jpg"
  );
  const [sectionTwoColTwoImage, setSectionTwoColTwoImage] = useState(
    acerca?.sections[1].boxes[2].images[0].url ||
      "/images/shopout_about_us_cover.jpg"
  );

  const [sectionTwoColThreeImage, setSectionTwoColThreeImage] = useState(
    acerca?.sections[1].boxes[3].images[0].url ||
      "/images/shopout_about_us_cover.jpg"
  );
  // section 3
  const [sectionThreeImage, setSectionThreeImage] = useState(
    acerca?.sections[2].boxes[0].images[0].url ||
      "/images/shopout_about_us_cover.jpg"
  );
  // section 4
  const [sectionFourImage, setSectionFourImage] = useState(
    acerca?.sections[3].boxes[0].images[0].url ||
      "/images/shopout_about_us_cover.jpg"
  );
  // sections
  let currentData = [];
  if (acerca?.sections) {
    currentData = acerca?.sections;
  } else {
    currentData = [
      {
        id: 0,
        index: 0,
        boxes: [
          {
            id: 0,
            index: 0,
            preTitle: "",
            title: "",
            subTitle: "",
            images: [
              {
                url: "/images/blog_placeholder.jpeg",
              },
            ],
            paragraphs: [
              {
                text: "",
              },
            ],
            button: "",
          },
        ],
      },
    ];
  }

  const [sections, setSections] = useState(currentData);
  const [createdAt, setCreatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [validationError, setValidationError] = useState(null);

  // functions
  const upload = async (e) => {
    // Get selected files from the input element.
    let files = e?.target.files;
    let section = e?.target.id;
    if (files) {
      for (var i = 0; i < files?.length; i++) {
        var file = files[i];
        // Retrieve a URL from our server.
        retrieveNewURL(file, (file, url) => {
          const parsed = JSON.parse(url);
          url = parsed.url;
          // Upload the file to the server.
          uploadFile(file, url, section);
        });
      }
    }
  };

  // generate a pre-signed URL for use in uploading that file:
  async function retrieveNewURL(file, cb) {
    const endpoint = `/api/minio`;
    fetch(endpoint, {
      method: "PUT",
      headers: {
        Name: file.name,
      },
    })
      .then((response) => {
        response.text().then((url) => {
          cb(file, url);
        });
      })
      .catch((e) => {
        console.error(e);
      });
  }

  // to upload this file to S3 at `https://minio.salvawebpro.com:9000` using the URL:
  async function uploadFile(file, url, section) {
    fetch(url, {
      method: "PUT",
      body: file,
    })
      .then(() => {
        // If multiple files are uploaded, append upload status on the next line.
        // document.querySelector(
        //   '#status'
        // ).innerHTML += `<br>Uploaded ${file.name}.`;
        const newUrl = url.split("?");
        if (section === "mainImageSelector") {
          setMainImage(newUrl[0]);
        }
        if (section === "sectionTwoColOneImageSelector") {
          setSectionTwoColOneImage(newUrl[0]);
        }
        if (section === "sectionTwoColTwoImageSelector") {
          setSectionTwoColTwoImage(newUrl[0]);
        }
        if (section === "sectionTwoColThreeImageSelector") {
          setSectionTwoColThreeImage(newUrl[0]);
        }
        if (section === "sectionThreeImageSelector") {
          setSectionThreeImage(newUrl[0]);
        }
        if (section === "sectionFourImageSelector") {
          setSectionFourImage(newUrl[0]);
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }

  const handleInputChange = (event, sectionIndex, boxIndex, key, paraIndex) => {
    const { value } = event.target;
    const input = event.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setSections((prevSections) => {
      const section = prevSections[sectionIndex];
      if (!section) {
        // If the section doesn't exist, create it along with the box and paragraphs array
        const newBox = {
          id: boxIndex,
          index: boxIndex,
          [key]: paraIndex !== undefined ? [{ text: value }] : value,
          paragraphs: paraIndex !== undefined ? [{ text: value }] : [],
        };
        const newSection = {
          id: boxIndex, // You can set the ID to the same as boxIndex
          index: sectionIndex,
          boxes: [newBox],
        };
        return [...prevSections, newSection];
      }

      // If the section exists
      const box = section.boxes[boxIndex];
      if (!box) {
        // If the box doesn't exist, create it along with the paragraphs array
        const newBox = {
          id: boxIndex,
          index: boxIndex,
          [key]: paraIndex !== undefined ? [{ text: value }] : value,
          paragraphs: paraIndex !== undefined ? [{ text: value }] : [],
          images:
            paraIndex !== undefined
              ? [{ url: value }]
              : [{ url: "/images/blog_placeholder.jpeg" }],
        };
        section.boxes.push(newBox);
      } else {
        // If the box exists, update its content
        if (key === "paragraphs") {
          const updatedParagraphs =
            paraIndex !== undefined ? [...box.paragraphs] : [{ text: value }];
          if (paraIndex !== undefined) {
            updatedParagraphs[paraIndex] = { text: value };
          }
          box[key] = updatedParagraphs;
        } else {
          box[key] = value;
        }
      }
      return [...prevSections];
    });
  };

  // Function to handle Main Section changes
  const handleMainSectionChange = (event) => {
    const { name, value } = event.target;

    const input = event.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    if (name === "preTitle") {
      setPreTitle(value);
    }
    if (name === "mainTitle") {
      setMainTitle(value);
    }
    if (name === "subTitle") {
      setSubTitle(value);
    }
  };

  // send form
  async function action() {
    if (mainImage === "/images/blog_placeholder.jpeg") {
      const noFileError = {
        mainImage: { _errors: ["Se requiere una imagen Principal"] },
      };
      setValidationError(noFileError);
      return;
    }
    if (!mainTitle) {
      const noTitleError = {
        mainTitle: { _errors: ["Se requiere un titulo para el Blog"] },
      };
      setValidationError(noTitleError);
      return;
    }

    const formData = new FormData();
    formData.append("category", "acerca");
    formData.append("preTitle", preTitle);
    formData.append("mainTitle", mainTitle);
    formData.append("subTitle", subTitle);
    formData.append("mainImage", mainImage);
    sections[1].boxes[1].images[0].url = sectionTwoColOneImage;
    sections[1].boxes[2].images[0].url = sectionTwoColTwoImage;
    sections[1].boxes[3].images[0].url = sectionTwoColThreeImage;
    sections[2].boxes[0].images[0].url = sectionThreeImage;
    sections[3].boxes[0].images[0].url = sectionFourImage;
    const sectionsJson = JSON.stringify(sections);
    formData.append("sections", sectionsJson);
    formData.append("createdAt", createdAt);
    // write to database using server actions
    let result;
    if (acerca?.sections) {
      formData.append("_id", acerca._id);
      result = await updatePage(formData);
    } else {
      result = await addNewPage(formData);
    }
    if (result?.error) {
      console.log(result?.error);
      setValidationError(result.error);
    } else {
      setValidationError(null);
      //reset the form
      formRef.current.reset();
      router.push("/nosotros");
    }
  }

  const handleInputKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center ">
        <form action={action} ref={formRef} className="w-full">
          <nav className="mx-auto  w-full flex flex-row items-center justify-between mb-10">
            <div className="flex items-center justify-end gap-4 ml-auto w-full">
              {acerca ? (
                <button
                  type="submit"
                  className="bg-black rounded-full text-white px-6 py-2"
                >
                  Actualizar
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-black rounded-full text-white px-6 py-2"
                >
                  Publicar
                </button>
              )}
            </div>
          </nav>
          <AnimationWrapper>
            {/* Main section */}
            <section className="w-full h-[600px] relative mx-auto  my-2 flex flex-col justify-center items-center">
              <textarea
                name="preTitle"
                value={preTitle}
                onChange={handleMainSectionChange}
                placeholder="Bienvenido a "
                className="font-bold font-EB_Garamond text-xl uppercase  z-20 flex flex-wrap items-center gap-1  mb-5 text-center text-white bg-background bg-opacity-0 leading-none py-0 outline-none"
              />
              {validationError?.preTitle && (
                <p className="text-sm text-red-400">
                  {validationError.preTitle._errors.join(", ")}
                </p>
              )}

              <textarea
                name="mainTitle"
                value={mainTitle}
                onChange={handleMainSectionChange}
                placeholder="Ofertazos MX"
                className="font-bold font-EB_Garamond uppercase text-5xl maxsm:text-3xl  z-20  text-white text-center  outline-none bg-background bg-opacity-0 leading-none resize-none py-0"
                onKeyDown={handleInputKeyDown}
              />
              {validationError?.mainTitle && (
                <p className="text-sm text-red-400">
                  {validationError.mainTitle._errors.join(", ")}
                </p>
              )}

              <textarea
                name="subTitle"
                value={subTitle}
                onChange={handleMainSectionChange}
                placeholder="Tu destino exclusivo para la moda de lujo! "
                className="font-bold font-EB_Garamond text-xl text-white w-1/2 z-20  mb-5 text-center bg-background bg-opacity-0 outline-none resize-none"
              />
              {validationError?.subTitle && (
                <p className="text-sm text-red-400">
                  {validationError.subTitle._errors.join(", ")}
                </p>
              )}

              <label htmlFor="mainImageSelector" className="cursor-pointer">
                <Image
                  id="mainImage"
                  className="rounded-md object-cover z-0 grayscale absolute"
                  src={mainImage}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="imagen de producto"
                />
                {/* overlay */}
                <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
                <input
                  id="mainImageSelector"
                  type="file"
                  accept=".png, .jpg, .jpeg, .webp"
                  hidden
                  onChange={upload}
                />
              </label>
            </section>
            {/*  Section 0 */}
            <section className="bg-gray-100 text-center py-12 my-20 w-[50%] maxmd:w-[90%] p-5 mx-auto">
              <div className="container mx-auto">
                <div className="mx-auto">
                  <div className="flex h-full flex-col gap-y-6 justify-center  text-center">
                    <motion.h2
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className="text-5xl maxmd:text-2xl font-bold font-EB_Garamond "
                    >
                      <input
                        name="sectionOneTitle"
                        value={sections[0]?.boxes[0]?.title}
                        onChange={(e) => handleInputChange(e, 0, 0, "title")}
                        placeholder="Experiencia Personalizada"
                        className="font-bold bg-background bg-opacity-10 w-full text-center outline-none"
                      />
                      {validationError?.sectionOneTitle && (
                        <p className="text-sm text-red-400">
                          {validationError.sectionOneTitle._errors.join(", ")}
                        </p>
                      )}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.9 }}
                      className="text-base font-poppins text-gray-700"
                    >
                      <textarea
                        rows="5"
                        className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full text-center outline-none resize-none"
                        placeholder="En Ofertazos MX, nos enorgullece ofrecer una experiencia de compra en línea única, donde la elegancia se encuentra con la conveniencia. Nos especializamos en llevar lo último de las marcas de lujo más codiciadas del mundo, como Gucci, Versace, Fendi y muchas más, directamente a tu puerta."
                        value={sections[0]?.boxes[0]?.paragraphs[0].text}
                        onChange={(e) =>
                          handleInputChange(e, 0, 0, "paragraphs", 0)
                        }
                        name="sectionOneParagraph"
                      ></textarea>
                      {validationError?.sectionOneParagraph && (
                        <p className="text-sm text-red-400">
                          {validationError.sectionOneParagraph._errors.join(
                            ", "
                          )}
                        </p>
                      )}
                    </motion.p>
                  </div>
                </div>
              </div>
            </section>
            {/*  Section 1 */}
            <section className=" text-center py-12 my-20 w-[80%] maxmd:w-[100%] mx-auto">
              <div className="container mx-auto">
                <h3 className="text-6xl maxsm:text-4xl font-semibold font-EB_Garamond text-gray-800 mb-5">
                  <textarea
                    type="text"
                    className="appearance-none bg-gray-100 bg-opacity-0 leading-none outline-none  w-full text-center resize-none"
                    placeholder="¿Por qué elegirnos?"
                    value={sections[1]?.boxes[0]?.title}
                    onChange={(e) => handleInputChange(e, 1, 0, "title")}
                    name="sectionTwoTitle"
                  />
                  {validationError?.sectionTwoTitle && (
                    <p className="text-sm text-red-400">
                      {validationError.sectionTwoTitle._errors.join(", ")}
                    </p>
                  )}
                </h3>
                <p className="text-gray-800 font-semibold">
                  <textarea
                    type="text"
                    className="appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none w-full text-center resize-none"
                    placeholder="En Ofertazos MX, nos dedicamos a brindar:"
                    value={sections[1]?.boxes[0]?.subTitle}
                    onChange={(e) => handleInputChange(e, 1, 0, "subTitle")}
                    name="sectionTwoSubTitle"
                  />
                  {validationError?.sectionTwoSubTitle && (
                    <p className="text-sm text-red-400">
                      {validationError.sectionTwoSubTitle._errors.join(", ")}
                    </p>
                  )}
                </p>

                <div className="grid grid-cols-3 maxsm:grid-cols-1 gap-4 mt-5">
                  <div className="bg-background rounded-lg p-8 maxmd:p-2 shadow-md">
                    <label
                      htmlFor="sectionTwoColOneImageSelector"
                      className="cursor-pointer"
                    >
                      <Image
                        id="sectionTwoColOneImage"
                        className="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
                        src={sectionTwoColOneImage}
                        width={100}
                        height={100}
                        sizes="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
                        alt="Icon"
                      />
                      <input
                        id="sectionTwoColOneImageSelector"
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        hidden
                        onChange={upload}
                      />
                    </label>

                    <div className="mx-auto">
                      <div className="flex h-full flex-col gap-y-6 justify-center  text-center">
                        <motion.h2
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="text-5xl maxmd:text-2xl font-bold font-EB_Garamond "
                        >
                          <textarea
                            type="text"
                            className="appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none w-full text-center resize-none"
                            placeholder="1. Autenticidad Garantizada: "
                            value={sections[1]?.boxes[1]?.title}
                            onChange={(e) =>
                              handleInputChange(e, 1, 1, "title")
                            }
                            name="sectionTwoColOneTitle"
                          />
                          {validationError?.sectionTwoColOneTitle && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionTwoColOneTitle._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </motion.h2>
                        <motion.p
                          initial={{ y: 40, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.9 }}
                          className="text-base font-poppins text-gray-700"
                        >
                          <textarea
                            rows="5"
                            className="appearance-none bg-gray-100 bg-opacity-0  py-0 outline-none w-full text-center resize-none"
                            placeholder="Cada producto que vendemos es auténtico y directamente adquirido de las casas de moda más prestigiosas del mundo. Puedes comprar con confianza, sabiendo que estás recibiendo productos genuinos y de alta calidad."
                            value={sections[1]?.boxes[1]?.paragraphs[0]?.text}
                            onChange={(e) =>
                              handleInputChange(e, 1, 1, "paragraphs", 0)
                            }
                            name="sectionTwoColOneParagraph"
                          ></textarea>
                          {validationError?.sectionTwoColOneParagraph && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionTwoColOneParagraph._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-8 shadow-md maxmd:p-2">
                    <label
                      htmlFor="sectionTwoColTwoImageSelector"
                      className="cursor-pointer"
                    >
                      <Image
                        id="sectionTwoColTwoImage"
                        className="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
                        src={sectionTwoColTwoImage}
                        width={100}
                        height={100}
                        sizes="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
                        alt="Icon"
                      />
                      <input
                        id="sectionTwoColTwoImageSelector"
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        hidden
                        onChange={upload}
                      />
                    </label>

                    <div className="mx-auto">
                      <div className="flex h-full flex-col gap-y-6 justify-center  text-center">
                        <motion.h2
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="text-5xl maxmd:text-2xl font-bold font-EB_Garamond "
                        >
                          <textarea
                            type="text"
                            className="appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none w-full text-center resize-none"
                            placeholder="2. Variedad Exclusiva: "
                            value={sections[1]?.boxes[2]?.title}
                            onChange={(e) =>
                              handleInputChange(e, 1, 2, "title")
                            }
                            name="sectionTwoColTwoTitle"
                          />
                          {validationError?.sectionTwoColTwoTitle && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionTwoColTwoTitle._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </motion.h2>
                        <motion.p
                          initial={{ y: 40, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.9 }}
                          className="text-base font-poppins text-gray-700"
                        >
                          <textarea
                            rows="5"
                            className="appearance-none bg-gray-100 bg-opacity-0 e py-0 outline-none w-full text-center resize-none"
                            placeholder="Nuestra selección de marcas de lujo es cuidadosamente curada para ofrecer una variedad exclusiva de productos de moda. Desde elegantes bolsos hasta ropa de diseñador, tenemos todo lo que necesitas para expresar tu estilo único."
                            value={sections[1]?.boxes[2]?.paragraphs[0]?.text}
                            onChange={(e) =>
                              handleInputChange(e, 1, 2, "paragraphs", 0)
                            }
                            name="sectionTwoColTwoParagraph"
                          ></textarea>
                          {validationError?.sectionTwoColTwoParagraph && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionTwoColTwoParagraph._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </motion.p>
                      </div>
                    </div>
                    <div className="mt-10" />
                  </div>
                  <div className="bg-background rounded-lg p-8 shadow-md maxmd:p-2">
                    <label
                      htmlFor="sectionTwoColThreeImageSelector"
                      className="cursor-pointer"
                    >
                      <Image
                        id="sectionTwoColThreeImage"
                        className="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
                        src={sectionTwoColThreeImage}
                        width={100}
                        height={100}
                        sizes="mx-auto mb-4 w-20 h-20 rounded-full grayscale"
                        alt="Icon"
                      />
                      <input
                        id="sectionTwoColThreeImageSelector"
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        hidden
                        onChange={upload}
                      />
                    </label>

                    <div className="mx-auto">
                      <div className="flex h-full flex-col gap-y-6 justify-center  text-center">
                        <motion.h2
                          initial={{ y: 30, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="text-5xl maxmd:text-2xl font-bold font-EB_Garamond "
                        >
                          <textarea
                            type="text"
                            className="appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none w-full text-center resize-none"
                            placeholder="3. Atención Personalizada: "
                            value={sections[1]?.boxes[3]?.title}
                            onChange={(e) =>
                              handleInputChange(e, 1, 3, "title")
                            }
                            name="sectionTwoColThreeTitle"
                          />
                          {validationError?.sectionTwoColThreeTitle && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionTwoColThreeTitle._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </motion.h2>
                        <motion.p
                          initial={{ y: 40, opacity: 0 }}
                          whileInView={{ y: 0, opacity: 1 }}
                          transition={{ duration: 0.9 }}
                          className="text-base font-poppins text-gray-700"
                        >
                          <textarea
                            rows="5"
                            className="appearance-none bg-gray-100 bg-opacity-0  py-0 outline-none w-full text-center resize-none"
                            placeholder="En Ofertazos MX, valoramos a cada cliente y nos esforzamos por brindar un servicio personalizado. Nuestro equipo de atención al cliente está siempre dispuesto a ayudarte con cualquier pregunta o inquietud que puedas tener."
                            value={sections[1]?.boxes[3]?.paragraphs[0]?.text}
                            onChange={(e) =>
                              handleInputChange(e, 1, 3, "paragraphs", 0)
                            }
                            name="sectionTwoColThreeParagraph"
                          ></textarea>
                          {validationError?.sectionTwoColThreeParagraph && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionTwoColThreeParagraph._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </motion.p>
                      </div>
                    </div>
                    <div className="mt-10" />
                  </div>
                </div>
              </div>
            </section>
            {/* Section 2 */}
            <div className="flex flex-row w-[80%] maxmd:w-full maxmd:flex-col items-center mx-auto my-20 px-1">
              <section className="text-center w-1/2 maxmd:w-full">
                <div className="container mx-auto px-6 sm:px-3">
                  <div className="mx-auto">
                    <div className="flex h-full flex-col gap-y-6 justify-center">
                      <motion.h2
                        initial={{ y: 30, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl maxmd:text-2xl font-bold font-EB_Garamond uppercase tracking-widest "
                      >
                        <textarea
                          name="sectionThreeTitle"
                          value={sections[2]?.boxes[0]?.title}
                          onChange={(e) => handleInputChange(e, 2, 0, "title")}
                          placeholder="Nuestra Misión"
                          className="appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none w-full text-center resize-none"
                        />
                        {validationError?.sectionThreeTitle && (
                          <p className="text-sm text-red-400">
                            {validationError.sectionThreeTitle._errors.join(
                              ", "
                            )}
                          </p>
                        )}
                      </motion.h2>
                      <motion.p
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-base font-poppins text-gray-700"
                      >
                        <textarea
                          rows="2"
                          className="appearance-none bg-gray-100 bg-opacity-0 py-0 outline-none w-full text-center resize-none"
                          placeholder="Nuestra misión es hacer que cada cliente se sienta como una estrella de la moda al proporcionar acceso a productos de alta calidad y estilo incomparable."
                          value={sections[2]?.boxes[0]?.paragraphs[0]?.text}
                          onChange={(e) =>
                            handleInputChange(e, 2, 0, "paragraphs", 0)
                          }
                          name="sectionThreeParagraph"
                        ></textarea>
                        {validationError?.sectionThreeParagraph && (
                          <p className="text-sm text-red-400">
                            {validationError.sectionThreeParagraph._errors.join(
                              ", "
                            )}
                          </p>
                        )}
                      </motion.p>
                      <motion.p
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.7 }}
                        className="text-base font-poppins text-gray-700"
                      >
                        <textarea
                          rows="2"
                          className="appearance-none bg-gray-100 bg-opacity-0 py-0 outline-none w-full text-center resize-none"
                          placeholder="En Ofertazos MX, no solo vendemos ropa y accesorios de lujo, sino que también ofrecemos un servicio excepcional que eleva tu experiencia de compra a un nivel superior."
                          value={sections[2]?.boxes[0]?.paragraphs[1]?.text}
                          onChange={(e) =>
                            handleInputChange(e, 2, 0, "paragraphs", 1)
                          }
                          name="sectionThreeParagraphTwo"
                        ></textarea>
                        {validationError?.sectionThreeParagraphTwo && (
                          <p className="text-sm text-red-400">
                            {validationError.sectionThreeParagraphTwo._errors.join(
                              ", "
                            )}
                          </p>
                        )}
                      </motion.p>
                      {/* button */}
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        className="flex gap-x-4 mt-2 justify-center"
                      >
                        <p className="py-3 px-8 rounded-full bg-greenLight text-white duration-700 text-sm uppercase font-semibold w-1/2 bg-black">
                          <input
                            name="sectionThreeButton"
                            value={sections[2]?.boxes[0]?.button}
                            onChange={(e) =>
                              handleInputChange(e, 2, 0, "button")
                            }
                            placeholder="Ponte en Contacto"
                            className="text-white appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none w-full text-center resize-none"
                          />
                          {validationError?.sectionThreeButton && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionThreeButton._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>
              {/* Section 3 */}
              <section className=" text-center w-1/2 maxmd:w-full maxmd:mt-5">
                {/* Image */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.2 }}
                  className="flex gap-x-4 mt-2 justify-center"
                >
                  <div className="bg-background rounded-lg p-4 shadow-md">
                    <label
                      htmlFor="sectionThreeImageSelector"
                      className="cursor-pointer"
                    >
                      <Image
                        id="sectionThreeImage"
                        className="mx-auto mb-4 w-full h-full grayscale"
                        src={sectionThreeImage}
                        width={400}
                        height={400}
                        alt="imagen de blog"
                      />

                      <input
                        id="sectionThreeImageSelector"
                        type="file"
                        accept=".png, .jpg, .jpeg, .webp"
                        hidden
                        onChange={upload}
                      />
                    </label>
                  </div>
                </motion.div>
              </section>
            </div>

            <section className="w-full h-[600px] relative mx-auto  my-2 flex flex-col justify-center items-center">
              <textarea
                name="sectionFourTitle"
                value={sections[3]?.boxes[0]?.title}
                onChange={(e) => handleInputChange(e, 3, 0, "title")}
                placeholder="Únete a la experiencia de compra de lujo"
                className="font-bold font-EB_Garamond text-6xl appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none text-center resize-none z-20  text-white bg-transparent"
              />
              {validationError?.sectionFourTitle && (
                <p className="text-sm text-red-400">
                  {validationError.sectionFourTitle._errors.join(", ")}
                </p>
              )}

              <textarea
                name="sectionFourSubTitle"
                value={sections[3]?.boxes[0]?.subTitle}
                onChange={(e) => handleInputChange(e, 3, 0, "subTitle")}
                placeholder="Descubre la moda de alta gama con solo un clic."
                className="font-bold font-EB_Garamond text-xl appearance-none bg-gray-100 bg-opacity-0 leading-none py-0 outline-none text-center resize-none z-20 text-white bg-transparent w-4/6"
              />
              {validationError?.sectionFourSubTitle && (
                <p className="text-sm text-red-400">
                  {validationError.sectionFourSubTitle._errors.join(", ")}
                </p>
              )}
              {/* button */}

              <input
                name="sectionFourButton"
                value={sections[3]?.boxes[0]?.button}
                onChange={(e) => handleInputChange(e, 3, 0, "button")}
                placeholder="Tienda en Linea"
                className="font-bold bg-black text-white items-center gap-1 w-[350px] mb-3 text-center z-20 p-3 outline-none"
              />
              {validationError?.sectionFourButton && (
                <p className="text-sm text-red-400">
                  {validationError.sectionFourButton._errors.join(", ")}
                </p>
              )}

              <label
                htmlFor="sectionFourImageSelector"
                className="cursor-pointer "
              >
                <Image
                  id="sectionFourImage"
                  className="rounded-md object-cover z-0 grayscale absolute"
                  src={sectionFourImage}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  alt="imagen de producto"
                />
                {/* overlay */}
                <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />
                <input
                  id="sectionFourImageSelector"
                  type="file"
                  accept=".png, .jpg, .jpeg, .webp"
                  hidden
                  onChange={upload}
                />
              </label>
            </section>
          </AnimationWrapper>
        </form>
      </div>
    </div>
  );
};

export default NewAboutPageComponent;
