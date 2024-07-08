import { Typography } from "antd";
import Layout from "../../components/Layout";

//style
import "./style.css";

//ui
import Img from "../../components/Img";

//interface
interface DevelopersProps {
  name: string;
  title: string;
  email: string;
  imgSrc: string;
}

const developers: DevelopersProps[] = [
  {
    name: "Ashlliee Æ Noblezza",
    title: "Programmer",
    email: "@gmail.com",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/system%2Fash.jpg?alt=media&token=2ff5b7dd-5379-4491-8282-b2cbca81ca22",
  },
  {
    name: "Jude Demnuvar Linga Ribleza",
    title: "Programmer",
    email: "juderibleza36@gmail.com",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/system%2FJudepogi.jpg?alt=media&token=43a5cf38-7157-46ca-939c-6a92116bf6bb",
  },

  {
    name: "Karylle M. Manrique",
    title: "Technical Writer",
    email: "manrinquekarylle891@gmail.com",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/system%2Fkarylle.jpg?alt=media&token=9fe8718d-32be-4fe7-a077-d5927dd2c254",
  },
  {
    name: "Shela May R. Rogelio",
    title: "Technical Writer",
    email: "shelamayrogelio@gmail.com",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/system%2Fshemay.jpg?alt=media&token=9e6f627d-3ebe-48a6-a84c-99557133cb81",
  },
  {
    name: "Christine Luz",
    title: "Technical Writer",
    email: "@gmail.com",
    imgSrc:
      "https://firebasestorage.googleapis.com/v0/b/audit-tracker-d4e91.appspot.com/o/system%2Fluz.jpg?alt=media&token=16dfe5c5-993c-4336-bcfe-9f6778c7461a",
  },
];

const About = () => {
  return (
    <Layout
      className="main-container"
      style={{ width: "100%", height: "100%", display: "flex" }}
    >
      <div className="title-container">
        <Typography className="main-text">About us</Typography>
      </div>
      <div className="content">
        <Typography.Paragraph className="message-content">
          The present Department of the Interior and Local Government (DILG)
          traces its roots from the Philippine Revolution of 1897. On March 22,
          1897, the Katipunan Government established the first Department of
          Interior at the Tejeros Convention. A revolutionary government was
          also established at that time and the new government elected General
          Emilio Aguinaldo as President and Andres Bonifacio as Director of
          Interior, although Bonifacio did not assume the post. At the Naic
          Assembly held on April 17, 1897, President Aguinaldo appointed General
          Pascual Alvarez as Secretary of the Interior. The Department of
          Interior was enshrined in the Biak-na-Bato Constitution signed on
          November 1, 1897. Article XV of the said Constitution defined the
          powers and functions of the Department that included statistics, roads
          and bridges, agriculture, public information and posts, and public
          order. As the years of struggle for independence and self-government
          continued, the Interior Department became the premier office of the
          government tasked with various functions ranging from supervision over
          local units, forest conservation, public instructions, control and
          supervision over the police, counter-insurgency, rehabilitation,
          community development and cooperatives development programs. In 1950,
          the Department was abolished and its functions were transferred to the
          Office of Local Government (later renamed Local Government and Civil
          Affairs Office) under the Office of the President. On January 6, 1956,
          President Ramon Magsaysay created the Presidential Assistant on
          Community Development (PACD) to implement the Philippine Community
          Development Program that will coordinate and integrate on a national
          scale the efforts of various governmental and civic agencies to
          improve the living conditions in the barrio residents nationwide and
          make them self-reliant. In 1972, Presidential Decree No. 1 created the
          Department of Local Government and Community Development (DLGCD)
          through Letter of Implementation No. 7 on November 1, 1972. Ten years
          later or in 1982, the DLGCD was reorganized and renamed Ministry of
          Local Government (MLG) by virtue of Executive Order No. 777; and in
          1987, it was further reorganized and this time, renamed Department of
          Local Government (DLG) by virtue of Executive Order No. 262. Again, on
          December 13, 1990, the DLG underwent reorganization into what is now
          known as the Department of the Interior and Local Government (DILG) by
          virtue of Republic Act No. 6975. The law also created the Philippine
          National Police (PNP) out of the Philippine Constabulary-Integrated
          National Police (PC-INP), which, together with the National Police
          Commission, was integrated under the new DILG, the Bureau of Fire
          Protection, Bureau of Jail Management and Penology and the Philippine
          Public Safety College; and absorbed the National Action Committee on
          Anti-Hijacking from the Department of National Defense (DND). The
          passage of RA 6975 paved the way for the union of the local
          governments and the police force after more than 40 years of
          separation. Today, the Department faces a new era of meeting the
          challenges of local autonomy, peace and order, and public safety.
        </Typography.Paragraph>
        <div className="ref-section">
          <Typography>
            {" "}
            This content was not created by the developer. No copyright
            infringement intended. Reference:{" "}
          </Typography>
          <Typography.Link
            href="https://dilg.gov.ph/page/Who-we-are/19"
            target="_blank"
          >
            https://dilg.gov.ph/page/Who-we-are/19
          </Typography.Link>
        </div>

        <div className="title-container">
          <Typography className="main-text">About Audit Tracker</Typography>
        </div>

        <div>
          <Typography.Paragraph className="message-content">
            The Audit Tracker was developed to provide comprehensive solutions
            for the diverse monitoring programs of the Department of the
            Interior and Local Government (DILG) Provincial Office located in
            Bangbangalon, Boac, Marinduque. This system has the capability to
            create and add new programs, define their respective areas, and
            generate forms necessary for data collection, which includes the
            "Means of Verifications" (MOV). The Audit Tracker can be managed by
            DILG Provincial Office personnel or authorized users, ensuring
            centralized control and oversight. On the client side, municipal and
            barangay level users can access and comply with the system's
            requirements online. This feature allows for the full utilization of
            the Audit Tracker's capabilities, promoting efficient and effective
            monitoring and reporting processes.
          </Typography.Paragraph>
        </div>

        <div className="title-container">
          <Typography className="main-text">About Developers</Typography>
        </div>

        

        <div className="proponents-profile">
          {developers.map((item) => (
            <div className="developers" style={{ width: "100%", height: 400 }}>
              <div className="profile-pic">
                <Img
                  style={{ width: 200, height: 200 }}
                  src={item.imgSrc}
                  local={false}
                />
              </div>
              <div className="profile-info">
                <div>
                  <div className="info-item">
                    <Typography>Name:</Typography>
                    <Typography style={{ fontWeight: 500 }}>
                      {item.name}
                    </Typography>
                  </div>
                  <div className="info-item">
                    <Typography>Email:</Typography>
                    <Typography style={{ fontWeight: 500 }}>
                      {item.email}
                    </Typography>
                  </div>
                </div>

                <div className="info-pos">
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "1.2rem",
                      color: "#fff",
                    }}
                  >
                    {item.title}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{width: "100%", textAlign: "center",padding: "8px"}}>
          <Typography.Title level={3}>Team CICS</Typography.Title>
        </div>
        <div className="intern-details">
          <Typography.Paragraph lang="eng" className="message-content">
            The College of Information and Computing Science at Marinduque State
            College (MSC) and the Department of Interior and Local Government
            (DILG) formed a partnership for an internship program. February
            2024, five students from the Bachelor of Science in Information
            Technology (BSIT) program were deployed to the DILG. These students
            included Jude Demnuvar L. Ribleza and Reiner Asheley Nobleza, who
            majored in Software Development, as well as Karylle M. Manrique,
            Shela May R. Rogelio, and Christine Luz, who specialized in Network
            and Data Security. This internship provided these students with an
            opportunity to apply their skills and knowledge, gain valuable
            experience, and prepare for real-world work environments.
          </Typography.Paragraph>

          <Typography.Paragraph className="message-content">
          This internship provided these students with an invaluable opportunity to apply their academic knowledge and technical skills in a professional setting. Over the course of the internship, the students engaged in various projects and tasks that allowed them to gain hands-on experience and develop practical competencies.
          </Typography.Paragraph>

          <Typography.Paragraph className="message-content">
          Jude Demnuvar L. Ribleza and Reiner Asheley Nobleza contributed to software development project, where they worked on coding, debugging, and collaborating with other team members to develop innovative solutions. Their work involved the use of various programming languages and development tools, giving them a comprehensive understanding of the software development lifecycle.
          </Typography.Paragraph>

          <Typography.Paragraph className="message-content">
          Karylle M. Manrique, Shela May R. Rogelio, and Christine Luz assisted and contributed to the software development efforts led by Jude and Reiner. They were involved in content creation, designing logos, writing user manuals, and other non-coding tasks. Their support was vital in ensuring that the software projects were well-documented, user-friendly, and visually appealing.
          </Typography.Paragraph>

          <Typography.Paragraph className="message-content">
          In addition to the technical experience, the internship also helped the students develop soft skills such as teamwork, communication, and problem-solving. They learned to navigate the dynamics of a professional work environment, collaborate with colleagues, and meet project deadlines.
          </Typography.Paragraph>
        </div>
      </div>
    </Layout>
  );
};

export default About;
