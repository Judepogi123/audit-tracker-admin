import express from "express";
import { database } from "../firebase/dbConfig.js";
import { ref, push, set, child } from "firebase/database";

const router = express.Router();
router.use(express.json());

const data = {
  id: "12345",
  title: "Governance area",
  timestamp: "Sample Date",
  author: "NewAdmin",
  revisionNumber: 1,
  fields: [
    {
      id: "12345",
      title: "Finance",
      type: "field",
      dependencies: { method: "check_box", value: 30 },
      requirements: [
        {
          title: "Must 3 are pass",
          requiredId: ["12345a", "12345b", "12345c"],
        },
        {
          title: "Any",
          requiredId: ["12345a", "12345b", "12345c"],
        },
      ],
      indicators: [
        {
          id: "12345a",
          title: "3e321432",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "dasdasdasdjkshakjdhk",
          mov: "pdf",
          dataInputMethod: { type: "numMin%", value: 30 },
        },
        {
          id: "12345b",
          title: "dsfewr",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "daslkdhalskjhdjkasdh",
          mov: "any",
          dataInputMethod: {
            type: "radio_button",
            value: ["Modified", "dasdasd", "dasdasd"],
          },
        },
        {
          id: "12345c",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "check_box",
            value: ["dase213e", "dsadsadads", "fdsfsdfsdfdasdasd"],
          },
        },
        {
          id: "12345D",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "rating",
            value: [
              { rate: 1, desc: "sdasdhasjkdhk" },
              { rate: 3, desc: "sdasdhasjkdhk" },
              { rate: 5, desc: "sdasdhasjkdhk" },
            ],
          },
        },
        {
          id: "12345D",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "date",
            value: "Feb. 20, 2023",
          },
        },
      ],
    },
    {
      id: "12345",
      title: "Finance",
      type: "field",
      dependencies: { method: "check_box", value: 30 },
      requirements: [
        {
          title: "Must 3 are pass",
          requiredId: ["12345a", "12345b", "12345c"],
        },
        {
          title: "Any",
          requiredId: ["12345a", "12345b", "12345c"],
        },
      ],
      indicators: [
        {
          id: "12345a",
          title: "3e321432",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "dasdasdasdjkshakjdhk",
          mov: "pdf",
          dataInputMethod: { type: "numMin%", value: 30 },
        },
        {
          id: "12345b",
          title: "dsfewr",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "daslkdhalskjhdjkasdh",
          mov: "any",
          dataInputMethod: {
            type: "radio_button",
            value: ["Modified", "dasdasd", "dasdasd"],
          },
        },
        {
          id: "12345c",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "check_box",
            value: ["dase213e", "dsadsadads", "fdsfsdfsdfdasdasd"],
          },
        },
        {
          id: "12345D",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "rating",
            value: [
              { rate: 1, desc: "sdasdhasjkdhk" },
              { rate: 3, desc: "sdasdhasjkdhk" },
              { rate: 5, desc: "sdasdhasjkdhk" },
            ],
          },
        },
        {
          id: "12345D",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "date",
            value: "Feb. 20, 2023",
          },
        },
      ],
    },
    {
      id: "12345",
      title: "Finance",
      type: "field",
      dependencies: { method: "check_box", value: 30 },
      requirements: [
        {
          title: "Must 3 are pass",
          requiredId: ["12345a", "12345b", "12345c"],
        },
        {
          title: "Any",
          requiredId: ["12345a", "12345b", "12345c"],
        },
      ],
      indicators: [
        {
          id: "12345a",
          title: "3e321432",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "dasdasdasdjkshakjdhk",
          mov: "pdf",
          dataInputMethod: { type: "numMin%", value: 30 },
        },
        {
          id: "12345b",
          title: "dsfewr",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "daslkdhalskjhdjkasdh",
          mov: "any",
          dataInputMethod: {
            type: "radio_button",
            value: ["Modified", "dasdasd", "dasdasd"],
          },
        },
        {
          id: "12345c",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "check_box",
            value: ["dase213e", "dsadsadads", "fdsfsdfsdfdasdasd"],
          },
        },
        {
          id: "12345D",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "rating",
            value: [
              { rate: 1, desc: "sdasdhasjkdhk" },
              { rate: 3, desc: "sdasdhasjkdhk" },
              { rate: 5, desc: "sdasdhasjkdhk" },
            ],
          },
        },
        {
          id: "12345D",
          title: "dasdasdasd",
          type: "subInd",
          field: [],
          indicators: [],
          descriptions: "e3q2hwkjhsjkadhaskjdhas",
          mov: "pic",
          dataInputMethod: {
            type: "date",
            value: "Feb. 20, 2023",
          },
        },
      ],
    },
  ],
};

router.post("/testing", async (req, res) => {
  try {
    // const auditKey = ref(database, `Audit`)
    // const auditPushKey = await push(auditKey)
    // await set(ref(database,`Audit/${auditPushKey.key}`), data)

    const dataRef = ref(database, "Audit");
    const auditPushKey = await push(dataRef);

    await set(ref(database, `Audit/${auditPushKey.key}`), {
      author: data.author,
      timestamp: data.timestamp,
      revisionNumber: data.revisionNumber,
      title: data.title,
      id: auditPushKey.key,
    });

    const saveField = async (field, parentRef) => {
      console.log("Parent", field);
      const fieldPushKey = await push(ref(database, parentRef));
      const fieldRef = `${parentRef}/fields/${fieldPushKey.key}`;

      console.log(fieldRef);

      await set(ref(database, `${parentRef}/fields/${fieldPushKey.key}`), {
        id: fieldPushKey.key,
        title: field?.title,
        type: field?.type,
        dependencies: field?.dependencies ,
        requirements: field?.requirements ,
      });
      // if(field && field.length >0){
      //   for(let field of field.fields){

      //   }
      // }

      if (field.indicators && field.indicators.length > 0) {
        for (const indicator of field.indicators) {
          const indicatorPushKey = await push(
            ref(database, `${parentRef}/fields/${fieldPushKey.key}/indicators`)
          );
          const indicatorsRef = `${parentRef}/fields/${fieldPushKey.key}/indicators/${indicatorPushKey.key}`;
          await set(ref(database, indicatorsRef), {...indicator, id: indicatorPushKey.key});
        }
      }

      if (field.fields && field.fields.length > 0) {
        for (const subField of field.fields) {
          await saveField(subField, `${fieldRef}/fields`);
        }
      }
    };
    if (data.fields && data.fields.length > 0) {
      for (const field of data.fields) {
        await saveField(field, `Audit/${auditPushKey.key}`);
      }
    }

    console.log("Success");
    res.status(200).json({ message: "Successfully saved data" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "Error saving data", error: error });
  }
});

export default router;
