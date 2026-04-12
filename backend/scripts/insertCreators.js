import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

async function insertCreators() {
  try {
    await client.connect();
    const db = client.db("your_database_name"); // Replace with your actual database name
    const collection = db.collection("creaters");

    const creators = [
      { name:"Dr. Shivanagowda G. M.", email:"shivanagowda@gmail.com", password:"GMIT@2026", mobile_no:"9876543211", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Dr. Chethan Chandra S Basavaraddi", email:"Chethanchandrasb.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543212", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Dr. Santoshkumar Mahendrakar", email:"santoshkumarm@gmit.ac.in", password:"GMIT@2026", mobile_no:"9876543213", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mrs. Nayana K", email:"nayanak@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543214", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mrs. Kavyashree P N", email:"Kavyashreepn@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543215", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Ranjitha D S", email:"ranjithads@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543216", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Nanditha G", email:"Nanditha@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543217", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mr. Ravinandan Jannu", email:"ravinandanjannu.fet.scst.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543218", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mr. Srijan Roy", email:"srijanroy.fet.cs@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543219", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Niveditha T Naik", email:"nivedithatnaik.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543220", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Sanjana A T", email:"sanjanaat.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543221", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Nayana G S", email:"nayanags.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543222", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Latha K B", email:"lathakb.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543223", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Deepti H G", email:"deeptihg.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543224", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Tanushree V M", email:"tanushreevm@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543225", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Deepika M D", email:"deepikamd.fet.scst.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543226", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mrs. Supriya M Kerakkanavar", email:"Supriyakerakkanavar.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543227", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mrs. Pallavi S", email:"pallavis.fet.scst@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543228", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mr. Saurya Ranjan Das", email:"saurya.bu@gmail.com", password:"GMIT@2026", mobile_no:"9876543229", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Shalini M R", email:"Shalinimr.fet.scst.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543230", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mrs. Sumana C", email:"Sumanac.fet.scst.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543231", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Saima Anjum", email:"saimaanjum.fet.scst.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543232", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Ranjitha J", email:"ranjithaj.fet.scst.cse@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543233", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mrs. Sindhu R R", email:"Sindhurr.fet.scst@gmu.sc.in", password:"GMIT@2026", mobile_no:"9876543234", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Ms. Pooja S Bidari", email:"poojasbidari@gmu.ac.in", password:"GMIT@2026", mobile_no:"9876543235", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" },
      { name:"Mr. Adithya M S", email:"adityams012@gmail.com", password:"GMIT@2026", mobile_no:"9876543236", designation:"Professor", faculty:"Engineering and Technology (FET)", school:"School of Computer Science and Technology (SCST)", department:"Computer Science & Engineering", programme:"B.Tech", discipline:"Computer Science" }
    ];

    for (let creator of creators) {
      const hashedPassword = await bcrypt.hash(creator.password, 10);

      await collection.updateOne(
        { email: creator.email },
        {
          $set: {
            ...creator,
            password: hashedPassword
          }
        },
        { upsert: true }
      );
    }

    console.log("✅ All creators inserted/updated with hashed passwords");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

insertCreators();