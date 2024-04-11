import express from "express";
import { database } from "../../../firebase/dbConfig.js";
import { ref, set, push } from "../../../firebase/dbConfig.js";

import { currentDate } from "../../../src/utils/_js-date-provider.js";

const router = express.Router();

router.post("/new-field", async (req, res) => {
  try {
    const request = req.body;
    if (!request) {
      return res
        .status(400)
        .json({ message: "Bad Request: Request body is missing." });
    }

    const auditPath = ref(database, "System/auditInfo/fields");
    const fieldPushKey = await push(auditPath);

    await set(ref(database, `System/auditInfo/fields/${fieldPushKey.key}`), {
      authorFullname: request.authorFullname,
      authorUsername: request.authorUsername,
      description: request.description,
      requirements: request.requirements
        ? JSON.stringify(request.requirements)
        : [],
      title: request.title,
      timestamp: currentDate,
      pushKey: fieldPushKey.key,
    });

    // const userLogsPath = ref(database, `System/Logs/systemLogs`);
    // const userLogsPushKey = await push(userLogsPath)

    // await set(ref(database, `System/Logs/systemLogs/${userLogsPushKey.key}`))

    if (request.indicators && request.indicators.length > 0) {
      const indicatorPath = ref(
        database,
        `System/auditInfo/fields/${fieldPushKey.key}/indicators`
      );
      for (let indicator of request.indicators) {
        const indicatorPushKey = await push(indicatorPath);
        await set(
          ref(
            database,
            `System/auditInfo/fields/${fieldPushKey.key}/indicators/${indicatorPushKey.key}`
          ),
          {
            dataInputMethod: {
              type: indicator?.dataInputMethod?.type,
              value: JSON.stringify(
                indicator?.dataInputMethod?.value || "null"
              ),
            },
            mov: indicator.mov,
            query: indicator.query,
            type: indicator.type,
            key: indicator.id,
            pushKey: indicatorPushKey.key,
            path: `${fieldPushKey.key}/indicators/${indicatorPushKey.key}`,
          }
        );

        if (indicator.subIndicator && indicator.subIndicator.length > 0) {
          const subIndicatorPath = ref(
            database,
            `System/auditInfo/fields/${fieldPushKey.key}/indicators/${indicatorPushKey.key}/subIndicator`
          );
          for (let subIndicator of indicator.subIndicator) {
            const subIndicatorPushKey = await push(subIndicatorPath);
            await set(
              ref(
                database,
                `System/auditInfo/fields/${fieldPushKey.key}/indicators/${indicatorPushKey.key}/subIndicator/${subIndicatorPushKey.key}`
              ),
              {
                dataInputMethod: {
                  type: subIndicator?.dataInputMethod?.type,
                  value: JSON.stringify(
                    subIndicator?.dataInputMethod?.value || "null"
                  ),
                },
                mov: subIndicator.mov,
                query: subIndicator.query,
                type: subIndicator.type,
                key: subIndicator.id,
                pushKey: subIndicatorPushKey.key,
                path: `${fieldPushKey.key}/indicators/${indicatorPushKey.key}/subIndicator/${subIndicatorPushKey.key}`
              }
            );

            if (
              subIndicator.subIndicator &&
              subIndicator.subIndicator.length > 0
            ) {
              const subIndicatorSecPath = ref(
                database,
                `System/auditInfo/fields/${fieldPushKey.key}/indicators/${indicatorPushKey.key}/subIndicator/${subIndicatorPushKey.key}/subIndicator`
              );
              for (let subIndicatorSec of subIndicator.subIndicator) {
                const subIndicatorSecPushKey = await push(subIndicatorSecPath);
                await set(
                  ref(
                    database,
                    `System/auditInfo/fields/${fieldPushKey.key}/indicators/${indicatorPushKey.key}/subIndicator/${subIndicatorPushKey.key}/subIndicator/${subIndicatorSecPushKey.key}`
                  ),
                  {
                    dataInputMethod: {
                      type: subIndicatorSec?.dataInputMethod?.type,
                      value: JSON.stringify(
                        subIndicatorSec?.dataInputMethod?.value || "null"
                      ),
                    },
                    mov: subIndicatorSec.mov,
                    query: subIndicatorSec.query,
                    type: subIndicatorSec.type,
                    key: subIndicatorSec.id,
                    pushKey: subIndicatorSecPushKey.key,
                    path: `${fieldPushKey.key}/indicators/${indicatorPushKey.key}/subIndicator/${subIndicatorPushKey.key}/subIndicator/${subIndicatorSecPushKey.key}`
                  }
                );
              }
            }
          }
        }
      }
    }
    res.status(200).json({ message: "success" });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Sorry something went wrong.: ${error.message}` });
  }
});

export default router;
