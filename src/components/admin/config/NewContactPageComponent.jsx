"use client";
import React, { useRef, useState } from "react";
import AnimationWrapper from "@/components/motions/AnimationWrapper";
import Image from "next/image";
import { motion } from "framer-motion";
import { cstDateTimeClient } from "@/backend/helpers";
import { addNewPage, updatePage } from "@/app/_actions";
import { useRouter } from "next/navigation";
import { IoMdAt, IoMdLocate, IoMdPhonePortrait } from "react-icons/io";

const NewContactPageComponent = ({ contacto }) => {
  const router = useRouter();
  const formRef = useRef();
  // Main section
  const [mainTitle, setMainTitle] = useState(contacto?.mainTitle || "");
  const [mainImage, setMainImage] = useState(
    contacto?.mainImage || "/images/medium-shot-woman-wardrobe-renovation.jpg"
  );
  const [preTitle, setPreTitle] = useState(contacto?.preTitle);
  const [subTitle, setSubTitle] = useState(contacto?.subTitle);

  // section 3
  const [sectionFourImage, setSectionFourImage] = useState(
    contacto?.sections[4].boxes[0].images[0].url ||
      "/images/shopout_about_us_cover.jpg"
  );

  // sections
  let currentData = [];
  if (contacto?.sections) {
    currentData = contacto?.sections;
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
          paragraphs:
            paraIndex !== undefined ? [{ text: value }] : [{ text: "" }],
          images:
            paraIndex !== undefined
              ? [{ url: value }]
              : [{ url: "/images/blog_placeholder.jpeg" }],
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
  async function action(e) {
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
    formData.append("category", "contacto");
    formData.append("preTitle", preTitle);
    formData.append("mainTitle", mainTitle);
    formData.append("subTitle", subTitle);
    formData.append("mainImage", mainImage);
    sections[4].boxes[0].images[0].url = sectionFourImage;
    const sectionsJson = JSON.stringify(sections);
    formData.append("sections", sectionsJson);
    formData.append("createdAt", createdAt);
    // write to database using server actions
    let result;
    if (contacto?.sections) {
      formData.append("_id", contacto._id);
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
      router.push("/contacto");
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
              {contacto ? (
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
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-[12px] uppercase pb-2 tracking-widest z-20"
              >
                <textarea
                  name="preTitle"
                  value={preTitle}
                  onChange={handleMainSectionChange}
                  placeholder="Bienvenido a Ofertazos MX"
                  className="font-bold font-EB_Garamond text-xl uppercase  z-20 flex flex-wrap items-center gap-1  mb-5 text-center text-white bg-white bg-opacity-0 leading-none py-0 outline-none"
                />
                {validationError?.preTitle && (
                  <p className="text-sm text-red-400">
                    {validationError.preTitle._errors.join(", ")}
                  </p>
                )}
              </motion.p>

              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="text-8xl maxmd:text-4xl font-EB_Garamond uppercase font-bold tracking-normal z-20"
              >
                <textarea
                  name="mainTitle"
                  value={mainTitle}
                  onChange={handleMainSectionChange}
                  placeholder="CONTACTO"
                  className="font-bold font-EB_Garamond uppercase text-5xl maxsm:text-3xl  z-20  text-white text-center  outline-none bg-white bg-opacity-0 leading-none resize-none py-0"
                  onKeyDown={handleInputKeyDown}
                />
                {validationError?.mainTitle && (
                  <p className="text-sm text-red-400">
                    {validationError.mainTitle._errors.join(", ")}
                  </p>
                )}
              </motion.h2>

              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-lg maxmd:text-sm pt-3 tracking-widest font-ubuntu z-20"
              >
                <textarea
                  name="subTitle"
                  value={subTitle}
                  onChange={handleMainSectionChange}
                  placeholder="Tu destino exclusivo para la moda de lujo!"
                  className="font-bold font-EB_Garamond text-xl text-white w-full z-20  mb-5 text-center bg-white bg-opacity-0 outline-none resize-none"
                />
                {validationError?.subTitle && (
                  <p className="text-sm text-red-400">
                    {validationError.subTitle._errors.join(", ")}
                  </p>
                )}
              </motion.p>

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
            <section className="bg-white py-12 px-20 maxsm:px-2">
              <div className="w-full flex flex-row maxmd:flex-col justify-center items-center">
                <div className="w-1/3 maxmd:w-full pl-20 maxmd:pl-0 text-lg text-gray-600 ">
                  <div className="relative h-full">
                    <div className="mt-34 flex flex-row maxmd:flex-col-reverse mx-auto my-14 w-[80%] maxmd:w-[100%] relative items-center">
                      <div className="flex flex-col w-full">
                        <h2 className="text-3xl font-semibold text-gray-800 font-playfair-display mb-6">
                          <input
                            name="sectionOneTitle"
                            value={sections[0]?.boxes[0]?.title}
                            onChange={(e) =>
                              handleInputChange(e, 0, 0, "title")
                            }
                            placeholder="Información de Contacto"
                            className="font-bold bg-white bg-opacity-10 w-full outline-none"
                          />
                          {validationError?.sectionOneTitle && (
                            <p className="text-sm text-red-400">
                              {validationError.sectionOneTitle._errors.join(
                                ", "
                              )}
                            </p>
                          )}
                        </h2>
                        <div className="flex flex-row gap-x-5 my-3">
                          <div className="flex justify-center items-center w-[60px] h-[60px] p-2 rounded-full">
                            <IoMdPhonePortrait className="w-[30px] h-[30px] text-gray-700" />
                          </div>
                          <div className="flex-col w-3/4">
                            <div className="font-EB_Garamond text-2xl">
                              <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className=""
                              >
                                <input
                                  name="sectionOneBoxOneTitle"
                                  value={sections[1]?.boxes[0]?.title}
                                  onChange={(e) =>
                                    handleInputChange(e, 1, 0, "title")
                                  }
                                  placeholder="Teléfono"
                                  className="font-bold bg-white bg-opacity-10 w-full  outline-none"
                                />
                                {validationError?.sectionOneBoxOneTitle && (
                                  <p className="text-sm text-red-400">
                                    {validationError.sectionOneBoxOneTitle._errors.join(
                                      ", "
                                    )}
                                  </p>
                                )}
                              </motion.h2>
                            </div>
                            <div className="text-xs">
                              <motion.p
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.9 }}
                                className="text-base font-poppins text-gray-700"
                              >
                                <textarea
                                  className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none leading-none h-10"
                                  placeholder="Platiquemos marca ahora mismo"
                                  value={sections[1]?.boxes[0]?.subTitle}
                                  onChange={(e) =>
                                    handleInputChange(e, 1, 0, "subTitle")
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

                            <motion.p
                              initial={{ y: 40, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.9 }}
                              className="text-base font-poppins text-gray-700"
                            >
                              <input
                                className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none"
                                placeholder="(+52)353-133-2430"
                                value={
                                  sections[1]?.boxes[0]?.paragraphs[0].text
                                }
                                onChange={(e) =>
                                  handleInputChange(e, 1, 0, "paragraphs", 0)
                                }
                                name="sectionOneParagraph"
                              />
                              {validationError?.sectionOneParagraphTwo && (
                                <p className="text-sm text-red-400">
                                  {validationError.sectionOneParagraphTwo._errors.join(
                                    ", "
                                  )}
                                </p>
                              )}
                            </motion.p>
                          </div>
                        </div>
                        <div className="flex flex-row gap-x-5 my-3">
                          <div className="flex justify-center items-center w-[60px] h-[60px]  p-2 rounded-full">
                            <IoMdAt className="w-[30px] h-[30px] text-gray-700" />
                          </div>
                          <div className="flex-col w-3/4">
                            <div className="font-playfair-display text-2xl">
                              <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className=""
                              >
                                <input
                                  name="sectionOneBoxTwoTitle"
                                  value={sections[2]?.boxes[0]?.title}
                                  onChange={(e) =>
                                    handleInputChange(e, 2, 0, "title")
                                  }
                                  placeholder="Correo Electrónico"
                                  className="font-bold bg-white bg-opacity-10 w-full  outline-none"
                                />
                                {validationError?.sectionOneBoxTwoTitle && (
                                  <p className="text-sm text-red-400">
                                    {validationError.sectionOneBoxTwoTitle._errors.join(
                                      ", "
                                    )}
                                  </p>
                                )}
                              </motion.h2>
                            </div>
                            <div className="text-xs">
                              <motion.p
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.9 }}
                                className="text-base font-poppins text-gray-700"
                              >
                                <textarea
                                  className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none leading-none h-10"
                                  placeholder="Manda un mensaje para resolver tus dudas"
                                  value={sections[2]?.boxes[0]?.subTitle}
                                  onChange={(e) =>
                                    handleInputChange(e, 2, 0, "subTitle")
                                  }
                                  name="sectionOneBoxTwoSubTitle"
                                ></textarea>
                                {validationError?.sectionOneBoxTwoSubTitle && (
                                  <p className="text-sm text-red-400">
                                    {validationError.sectionOneBoxTwoSubTitle._errors.join(
                                      ", "
                                    )}
                                  </p>
                                )}
                              </motion.p>
                            </div>

                            <motion.p
                              initial={{ y: 40, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.9 }}
                              className="text-base font-poppins text-gray-700"
                            >
                              <input
                                className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none"
                                placeholder="ofertazosmx@gmail.com.mx"
                                value={
                                  sections[2]?.boxes[0]?.paragraphs[0].text
                                }
                                onChange={(e) =>
                                  handleInputChange(e, 2, 0, "paragraphs", 0)
                                }
                                name="sectionOneBoxTwoParagraph"
                              />
                              {validationError?.sectionOneBoxTwoParagraph && (
                                <p className="text-sm text-red-400">
                                  {validationError.sectionOneBoxTwoParagraph._errors.join(
                                    ", "
                                  )}
                                </p>
                              )}
                            </motion.p>
                          </div>
                        </div>
                        <div className="flex flex-row gap-x-5 my-3">
                          <div className="flex justify-center items-center w-[60px] h-[60px]  p-2 rounded-full">
                            <IoMdLocate className="w-[30px] h-[30px] text-gray-700" />
                          </div>
                          <div className="flex-col w-3/4">
                            <div className="font-playfair-display text-2xl">
                              <motion.h2
                                initial={{ y: 30, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8 }}
                                className=""
                              >
                                <input
                                  name="sectionOneBoxThreeTitle"
                                  value={sections[3]?.boxes[0]?.title}
                                  onChange={(e) =>
                                    handleInputChange(e, 3, 0, "title")
                                  }
                                  placeholder="Oficinas"
                                  className="font-bold bg-white bg-opacity-10 w-full  outline-none"
                                />
                                {validationError?.sectionOneBoxThreeTitle && (
                                  <p className="text-sm text-red-400">
                                    {validationError.sectionOneBoxThreeTitle._errors.join(
                                      ", "
                                    )}
                                  </p>
                                )}
                              </motion.h2>
                            </div>
                            <div className="text-xs">
                              <motion.p
                                initial={{ y: 40, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.9 }}
                                className="text-base font-poppins text-gray-700"
                              >
                                <textarea
                                  className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none leading-none h-10"
                                  placeholder="No contamos con existencias en oficinas"
                                  value={sections[3]?.boxes[0]?.subTitle}
                                  onChange={(e) =>
                                    handleInputChange(e, 3, 0, "subTitle")
                                  }
                                  name="sectionOneBoxThreeSubtitle"
                                ></textarea>
                                {validationError?.sectionOneBoxThreeSubtitle && (
                                  <p className="text-sm text-red-400">
                                    {validationError.sectionOneBoxThreeSubtitle._errors.join(
                                      ", "
                                    )}
                                  </p>
                                )}
                              </motion.p>
                            </div>

                            <motion.p
                              initial={{ y: 40, opacity: 0 }}
                              whileInView={{ y: 0, opacity: 1 }}
                              transition={{ duration: 0.9 }}
                              className="text-base font-poppins text-gray-700"
                            >
                              <input
                                className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none"
                                placeholder="Juan Escutia 25, Sahuayo de Morelos, Michoacan 59053"
                                value={
                                  sections[3]?.boxes[0]?.paragraphs[0].text
                                }
                                onChange={(e) =>
                                  handleInputChange(e, 3, 0, "paragraphs", 0)
                                }
                                name="sectionOneBoxThreeParagraph"
                              />
                              {validationError?.sectionOneBoxThreeParagraph && (
                                <p className="text-sm text-red-400">
                                  {validationError.sectionOneBoxThreeParagraph._errors.join(
                                    ", "
                                  )}
                                </p>
                              )}
                            </motion.p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-2/3 pb-10 pl-20 maxsm:pl-1 maxsm:w-full  flex flex-col justify-start items-start ">
                  <div className="w-[100%] px-3map-class">
                    <iframe
                      className="border-none grayscale"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3747.8420733851167!2d-102.7274978!3d20.057056599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842efcb2dbd40ac5%3A0x197c824b03a2d9a5!2sJuan%20Escutia%2025%2C%20Centro%20Cuatro%2C%2059000%20Sahuayo%20de%20Morelos%2C%20Mich.!5e0!3m2!1ses-419!2smx!4v1703971976010!5m2!1ses-419!2smx"
                      width="100%"
                      height="450"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <div className="flex flex-row maxmd:flex-col py-20 w-[90%] justify-center items-center mx-auto">
                <div className="w-full maxmd:w-full z-10  maxmd:px-5 maxsm:px-1">
                  <div className=" pb-20 w-full">
                    <motion.h2
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      className=""
                    >
                      <input
                        name="sectionThreeBoxOneTitle"
                        value={sections[4]?.boxes[0]?.title}
                        onChange={(e) => handleInputChange(e, 4, 0, "title")}
                        placeholder="Envía un mensaje"
                        className="font-bold bg-white bg-opacity-10 w-full  outline-none text-7xl font-EB_Garamond"
                      />
                      {validationError?.sectionThreeBoxOneTitle && (
                        <p className="text-sm text-red-400">
                          {validationError.sectionThreeBoxOneTitle._errors.join(
                            ", "
                          )}
                        </p>
                      )}
                    </motion.h2>
                    <motion.p
                      initial={{ y: 40, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.9 }}
                      className="text-lg font-poppins text-gray-700"
                    >
                      <textarea
                        className="appearance-none  bg-gray-100 rounded-md py-2 px-3  w-full outline-none resize-none leading-none h-10"
                        placeholder="Mándanos un mensaje y en corto nos comunicaremos"
                        value={sections[4]?.boxes[0]?.subTitle}
                        onChange={(e) => handleInputChange(e, 4, 0, "subTitle")}
                        name="sectionThreeBoxOneSubtitle"
                      ></textarea>
                      {validationError?.sectionThreeBoxOneSubtitle && (
                        <p className="text-sm text-red-400">
                          {validationError.sectionThreeBoxOneSubtitle._errors.join(
                            ", "
                          )}
                        </p>
                      )}
                    </motion.p>
                  </div>
                </div>
                <div className="w-1/2 maxmd:w-full z-10 justify-center mx-auto items-center flex">
                  {/* Image */}
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2 }}
                    className="flex gap-x-4 mt-2 justify-center"
                  >
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <label
                        htmlFor="sectionFourImageSelector"
                        className="cursor-pointer"
                      >
                        <Image
                          id="sectionFourImage"
                          className="mx-auto mb-4 w-full h-full grayscale"
                          src={sectionFourImage}
                          width={1000}
                          height={1000}
                          alt="Contactar al equipo de Ofertazos MX"
                        />

                        <input
                          id="sectionFourImageSelector"
                          type="file"
                          accept=".png, .jpg, .jpeg, .webp"
                          hidden
                          onChange={upload}
                        />
                      </label>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>
          </AnimationWrapper>
        </form>
      </div>
    </div>
  );
};

export default NewContactPageComponent;
