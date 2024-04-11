const testings = [
  {
    id: "123",
    name: "dasdasdasd",
    list: [
      { id: "123a", name: "dasdasdasd" },
      { id: "123c", name: "342234fsdf" },
      {
        id: "123b",
        name: "gfhfghrty",
        list: [
          { id: "123aa", name: "fsdgfsdf234" },
          { id: "123cc", name: "fsdfsd" },
          { id: "123bb", name: "gfhfvcxvsdfghrty" },
        ],
      },
    ],
  },
  {
    id: "124",
    name: "dasdasdasd",
    list: [
      { id: "123a1", name: "dasdasdasd" },
      { id: "123c1", name: "342234fsdf" },
      {
        id: "123b1",
        name: "gfhfghrty",
        list: [
          { id: "123aa1", name: "fsdgfsdf234" },
          { id: "123cc1", name: "fsdfsd" },
          { id: "123bb1", name: "gfhfvcxvsdfghrty" },
        ],
      },
    ],
  },
  {
    id: "125",
    name: "dasdasdasd",
    list: [
      { id: "123a12", name: "dasdasdasd" },
      { id: "123c12", name: "342234fsdf" },
      {
        id: "123b12",
        name: "gfhfghrty",
        list: [
          { id: "123aa12", name: "fsdgfsdf234" },
          { id: "123cc12", name: "fsdfsd" },
          { id: "123bb12", name: "gfhfvcxvsdfghrty" },
        ],
      },
    ],
  },
];


function findElementBFS(data, targetId) {
    // Initialize an empty queue and a visited set.
    const queue = [];
    const visited = new Set();
  
    // Add the root of the data structure to the queue.
    queue.push(data);
    visited.add(data);
  
    // Explore the data structure level by level.
    while (queue.length > 0) {
      // Dequeue the first element from the queue.
      const currentElement = queue.shift();
  
      // Check if the current element is the target element.
      if (currentElement.id === targetId) {
        return currentElement; // Return the element if found
      }
  
      // If the current element has a list, explore its elements.
      if (currentElement.list) {
        for (const child of currentElement.list) {
          if (!visited.has(child)) {
            queue.push(child);
            visited.add(child);
          }
        }
      }
    }
  
    // If the element is not found, return undefined.
    return undefined;
  }
  
  // Example usage:
  const targetId = "123bb";
  const foundElement = findElementBFS(testing, targetId);
  
  if (foundElement) {
    console.log("Found element:", foundElement); // Output: { id: "123bb", name: "gfhfvcxvsdfghrty", list: [...] }
  } else {
    console.log("Element not found.");
  }
  


  // function findElementBFS(data: Element[], targetId: string): Element | undefined {
//   // Initialize an empty queue and a visited set.
//   const queue: Element[] = [];
//   const visited: Set<Element> = new Set();

//   // Add the root of the data structure to the queue.
//   queue.push(data[0]); // Assuming data[0] is the root element
//   visited.add(data[0]);

//   // Explore the data structure level by level.
//   while (queue.length > 0) {
//     // Dequeue the first element from the queue.
//     const currentElement = queue.shift()!; // Non-null assertion as visited check ensures existence

//     // Check if the current element is the target element.
//     if (currentElement.id === targetId) {
//       return currentElement; // Return the element if found
//     }

//     // If the current element has a list, explore its elements.
//     if (currentElement.list) {
//       for (const child of currentElement.list) {
//         if (!visited.has(child)) {
//           queue.push(child);
//           visited.add(child);
//         }
//       }
//     }
//   }

//   // If the element is not found, return undefined.
//   return undefined;
// }

// // Example usage:
// const targetId = "123bb12";
// const foundElement = findElementBFS(testing, targetId);

// if (foundElement) {
//   console.log("Found element:", foundElement);
// } else {
//   console.log("Element not found.");
// }

// interface Element {
//     id: string;
//     name: string;
//     list?: Element[]; // Optional list property
//   }
  
  const testing= [
    {
      id: "123",
      name: "dasdasdasd",
      list: [
        { id: "123a", name: "dasdasdasd" },
        { id: "123c", name: "342234fsdf" },
        {
          id: "123b",
          name: "gfhfghrty",
          list: [
            { id: "123aa", name: "fsdgfsdf234" },
            { id: "123cc", name: "fsdfsd" },
            { id: "123bb", name: "gfhfvcxvsdfghrty" },
          ],
        },
      ],
    },
    {
      id: "124",
      name: "dasdasdasd",
      list: [
        { id: "123a1", name: "dasdasdasd" },
        { id: "123c1", name: "342234fsdf" },
        {
          id: "123b1",
          name: "gfhfghrty",
          list: [
            { id: "123aa1", name: "fsdgfsdf234" },
            { id: "123cc1", name: "fsdfsd" },
            { id: "123bb1", name: "Jude is pogi" },
          ],
        },
      ],
    },
    {
      id: "125",
      name: "dasdasdasd",
      list: [
        { id: "123a12", name: "dasdasdasd" },
        { id: "123c12", name: "342234fsdf" },
        {
          id: "123b12",
          name: "gfhfghrty",
          list: [
            { id: "123aa12", name: "fsdgfsdf234" },
            { id: "123cc12", name: "fsdfsd" },
            {
              id: "123bb12",
              name: "gfhfvcxvsdfghrty",
              list: [
                { id: "123bb121", name: "435t34tgretg" },
                { id: "123bb124", name: "435t34tgretg" },
                { id: "123bb125", name: "New name" },
              ],
            },
          ],
        },
      ],
    },
  ];

  // function updateNestedObject(
  //   data: FieldProps[],
  //   id: string,
  //   updatedName: string
  // ) {
  //   const updatedData = [...data];
  
  //   const walk = (obj: FieldProps) => {
  //     if (obj.id === id) {
  //       obj.title = updatedName;
  //       return;
  //     }
  //     if (obj.fields) {
  //       obj.fields.forEach((item) => walk(item as unknown as FieldProps));
        
  //     }
  //   };
  
  //   data.forEach(walk);
  
  //   return updatedData;
  // }