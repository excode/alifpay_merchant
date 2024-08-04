
const Pool = require("pg").Pool;
const  env  = process.env;
// PLEASE CREATE THE DATABSE merchant and add new user
const pool = new Pool({
  user: env.DB_USER || 'postgres',
  password: env.DB_PASSWORD || "" ,
  host: env.DB_HOST || "127.0.0.1",
  port: env.DB_PORT || "5432",
  database: env.DB_NAME || "merchant" ,
  ssl:true
});
//console.log(pool);

module.exports = pool;
async function createTableIfNotExists() {
    let  client = await pool.connect()
   // const ext=`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    // REMOVE THIS FROM PRODUCTION
    //const createDBSQL="SELECT 'CREATE DATABASE merchant' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'merchant')"
   // const extResult = await client.query(createDBSQL);
   //const extDBResult = await client.query(ext);
    

       

    try {
        // Check if the table[bank] exists
        const tablebankExistsQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bank')";
        const tablebankExistsResult = await client.query(tablebankExistsQuery);
        const tablebankExists = tablebankExistsResult.rows[0].exists;
    
        if (!tablebankExists) {
          const createbankTableScript =`
          CREATE TABLE IF NOT EXISTS  bank(
					id SERIAL PRIMARY KEY,
					createby VARCHAR(100) NOT NULL  DEFAULT '',
					createat timestamp NOT NULL DEFAULT NOW(),
					updateby VARCHAR(100)  NULL,
					updateat timestamp  NULL,
					bank_id INTEGER NOT NULL DEFAULT 0,
					bank_name VARCHAR(100) NOT NULL  DEFAULT '',
					bank_logo_url VARCHAR(100) NOT NULL  DEFAULT ''
					);
          `
          await client.query(createbankTableScript);
          //console.log('Table bank created successfully!');
        } else {
         const bankCols= [
            {name:"createby",type:" VARCHAR(100)  NULL"},
{name:"createat",type:" timestamp  NULL"},
{name:"updateby",type:" VARCHAR(100)  NULL"},
{name:"updateat",type:" timestamp  NULL"},
{name:"bank_id",type:" INTEGER   NULL"},
{name:"bank_name",type:" VARCHAR(100)  NULL"},
{name:"bank_logo_url",type:" VARCHAR(100)  NULL"}
         ]
         for(var c=0;c<bankCols.length;c++){
         let colObj= bankCols[c];
         let columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'bank'
            AND column_name = '${colObj.name}'
        );
        `;
        let columnExistsResult = await client.query(columnExistsQuery);
        let columnExists = columnExistsResult.rows[0].exists;

        if (!columnExists) {
            // Add the new column
            const addColumnQuery = `ALTER TABLE bank ADD COLUMN ${colObj.name} ${colObj.type};`;
            await client.query(addColumnQuery);
        }
        } 
          //console.log('Table bank already exists.');
        }
      } catch (error) {
        console.log("ERROR: bank")
        console.error('Error:', error);
      }
    

    try {
        // Check if the table[bankaccount] exists
        const tablebankaccountExistsQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bankaccount')";
        const tablebankaccountExistsResult = await client.query(tablebankaccountExistsQuery);
        const tablebankaccountExists = tablebankaccountExistsResult.rows[0].exists;
    
        if (!tablebankaccountExists) {
          const createbankaccountTableScript =`
          CREATE TABLE IF NOT EXISTS  bankaccount(
					id SERIAL PRIMARY KEY,
					createby VARCHAR(100) NOT NULL  DEFAULT '',
					createat timestamp NOT NULL DEFAULT NOW(),
					updateby VARCHAR(100)  NULL,
					updateat timestamp  NULL,
					acctype_desc VARCHAR(100) NOT NULL  DEFAULT '',
					doc_status_id INTEGER NOT NULL DEFAULT 0,
					bank_id INTEGER NOT NULL DEFAULT 0,
					bank_name VARCHAR(100) NOT NULL  DEFAULT '',
					acc_no VARCHAR(100) NOT NULL  DEFAULT '',
					acctype_id NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					bankinfo_id INTEGER NOT NULL DEFAULT 0,
					acc_desc VARCHAR(100) NOT NULL  DEFAULT '',
					bank_logo_url VARCHAR(100) NOT NULL  DEFAULT ''
					);
          `
          await client.query(createbankaccountTableScript);
          //console.log('Table bankaccount created successfully!');
        } else {
         const bankaccountCols= [
            {name:"createby",type:" VARCHAR(100)  NULL"},
{name:"createat",type:" timestamp  NULL"},
{name:"updateby",type:" VARCHAR(100)  NULL"},
{name:"updateat",type:" timestamp  NULL"},
{name:"acctype_desc",type:" VARCHAR(100)  NULL"},
{name:"doc_status_id",type:" INTEGER   NULL"},
{name:"bank_id",type:" INTEGER   NULL"},
{name:"bank_name",type:" VARCHAR(100)  NULL"},
{name:"acc_no",type:" VARCHAR(100)  NULL"},
{name:"acctype_id",type:" NUMERIC(10, 2)   NULL"},
{name:"bankinfo_id",type:" INTEGER   NULL"},
{name:"acc_desc",type:" VARCHAR(100)  NULL"},
{name:"bank_logo_url",type:" VARCHAR(100)  NULL"}
         ]
         for(var c=0;c<bankaccountCols.length;c++){
         let colObj= bankaccountCols[c];
         let columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'bankaccount'
            AND column_name = '${colObj.name}'
        );
        `;
        let columnExistsResult = await client.query(columnExistsQuery);
        let columnExists = columnExistsResult.rows[0].exists;

        if (!columnExists) {
            // Add the new column
            const addColumnQuery = `ALTER TABLE bankaccount ADD COLUMN ${colObj.name} ${colObj.type};`;
            await client.query(addColumnQuery);
        }
        } 
          //console.log('Table bankaccount already exists.');
        }
      } catch (error) {
        console.log("ERROR: bankaccount")
        console.error('Error:', error);
      }
    

    try {
        // Check if the table[bankdocument] exists
        const tablebankdocumentExistsQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'bankdocument')";
        const tablebankdocumentExistsResult = await client.query(tablebankdocumentExistsQuery);
        const tablebankdocumentExists = tablebankdocumentExistsResult.rows[0].exists;
    
        if (!tablebankdocumentExists) {
          const createbankdocumentTableScript =`
          CREATE TABLE IF NOT EXISTS  bankdocument(
					id SERIAL PRIMARY KEY,
					createby VARCHAR(100) NOT NULL  DEFAULT '',
					createat timestamp NOT NULL DEFAULT NOW(),
					updateby VARCHAR(100)  NULL,
					updateat timestamp  NULL,
					acc_no VARCHAR(100) NOT NULL  DEFAULT '',
					bankimgname VARCHAR(100) NOT NULL  DEFAULT '',
					bankimgstring TEXT ,
					uid VARCHAR(100) NOT NULL  DEFAULT ''
					);
          `
          await client.query(createbankdocumentTableScript);
          //console.log('Table bankdocument created successfully!');
        } else {
         const bankdocumentCols= [
            {name:"createby",type:" VARCHAR(100)  NULL"},
{name:"createat",type:" timestamp  NULL"},
{name:"updateby",type:" VARCHAR(100)  NULL"},
{name:"updateat",type:" timestamp  NULL"},
{name:"acc_no",type:" VARCHAR(100)  NULL"},
{name:"bankimgname",type:" VARCHAR(100)  NULL"},
{name:"bankimgstring",type:" TEXT  NULL"},
{name:"uid",type:" VARCHAR(100)  NULL"}
         ]
         for(var c=0;c<bankdocumentCols.length;c++){
         let colObj= bankdocumentCols[c];
         let columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'bankdocument'
            AND column_name = '${colObj.name}'
        );
        `;
        let columnExistsResult = await client.query(columnExistsQuery);
        let columnExists = columnExistsResult.rows[0].exists;

        if (!columnExists) {
            // Add the new column
            const addColumnQuery = `ALTER TABLE bankdocument ADD COLUMN ${colObj.name} ${colObj.type};`;
            await client.query(addColumnQuery);
        }
        } 
          //console.log('Table bankdocument already exists.');
        }
      } catch (error) {
        console.log("ERROR: bankdocument")
        console.error('Error:', error);
      }
    

    try {
        // Check if the table[fundtransfer] exists
        const tablefundtransferExistsQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'fundtransfer')";
        const tablefundtransferExistsResult = await client.query(tablefundtransferExistsQuery);
        const tablefundtransferExists = tablefundtransferExistsResult.rows[0].exists;
    
        if (!tablefundtransferExists) {
          const createfundtransferTableScript =`
          CREATE TABLE IF NOT EXISTS  fundtransfer(
					id SERIAL PRIMARY KEY,
					createby VARCHAR(100) NOT NULL  DEFAULT '',
					createat timestamp NOT NULL DEFAULT NOW(),
					updateby VARCHAR(100)  NULL,
					updateat timestamp  NULL,
					amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					sourceaccount VARCHAR(100) NOT NULL  DEFAULT '',
					transfer_in_reference_id VARCHAR(100) NOT NULL  DEFAULT '',
					sourceaccounttokenize VARCHAR(100) NOT NULL  DEFAULT '',
					transfer_out_reference_id VARCHAR(100) NOT NULL  DEFAULT '',
					servicecharges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					gst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					destinationbankaccount VARCHAR(100) NOT NULL  DEFAULT '',
					trx_date  DATE NOT NULL  ,
					bankid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					cardpin INTEGER NOT NULL DEFAULT 0,
					reference VARCHAR(100) NOT NULL  DEFAULT ''
					);
          `
          await client.query(createfundtransferTableScript);
          //console.log('Table fundtransfer created successfully!');
        } else {
         const fundtransferCols= [
            {name:"createby",type:" VARCHAR(100)  NULL"},
{name:"createat",type:" timestamp  NULL"},
{name:"updateby",type:" VARCHAR(100)  NULL"},
{name:"updateat",type:" timestamp  NULL"},
{name:"amount",type:" NUMERIC(10, 2)   NULL"},
{name:"sourceaccount",type:" VARCHAR(100)  NULL"},
{name:"transfer_in_reference_id",type:" VARCHAR(100)  NULL"},
{name:"sourceaccounttokenize",type:" VARCHAR(100)  NULL"},
{name:"transfer_out_reference_id",type:" VARCHAR(100)  NULL"},
{name:"servicecharges",type:" NUMERIC(10, 2)   NULL"},
{name:"gst",type:" NUMERIC(10, 2)   NULL"},
{name:"destinationbankaccount",type:" VARCHAR(100)  NULL"},
{name:"trx_date",type:" DATE  NULL"},
{name:"bankid",type:" NUMERIC(10, 2)   NULL"},
{name:"cardpin",type:" INTEGER   NULL"},
{name:"reference",type:" VARCHAR(100)  NULL"}
         ]
         for(var c=0;c<fundtransferCols.length;c++){
         let colObj= fundtransferCols[c];
         let columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'fundtransfer'
            AND column_name = '${colObj.name}'
        );
        `;
        let columnExistsResult = await client.query(columnExistsQuery);
        let columnExists = columnExistsResult.rows[0].exists;

        if (!columnExists) {
            // Add the new column
            const addColumnQuery = `ALTER TABLE fundtransfer ADD COLUMN ${colObj.name} ${colObj.type};`;
            await client.query(addColumnQuery);
        }
        } 
          //console.log('Table fundtransfer already exists.');
        }
      } catch (error) {
        console.log("ERROR: fundtransfer")
        console.error('Error:', error);
      }
    

    try {
        // Check if the table[merchantInfo] exists
        const tablemerchantInfoExistsQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'merchantInfo')";
        const tablemerchantInfoExistsResult = await client.query(tablemerchantInfoExistsQuery);
        const tablemerchantInfoExists = tablemerchantInfoExistsResult.rows[0].exists;
    
        if (!tablemerchantInfoExists) {
          const createmerchantInfoTableScript =`
          CREATE TABLE IF NOT EXISTS  merchantinfo(
					id SERIAL PRIMARY KEY,
					createby VARCHAR(100) NOT NULL  DEFAULT '',
					createat timestamp NOT NULL DEFAULT NOW(),
					updateby VARCHAR(100)  NULL,
					updateat timestamp  NULL,
					contactperson VARCHAR(100) NOT NULL  DEFAULT '',
					mobileno VARCHAR(100) NOT NULL   UNIQUE,
					email VARCHAR(100) NOT NULL   UNIQUE,
					street VARCHAR(100) NOT NULL  DEFAULT '',
					address VARCHAR(100) NOT NULL  DEFAULT '',
					city VARCHAR(100) NOT NULL  DEFAULT '',
					state VARCHAR(100) NOT NULL  DEFAULT '',
					postcode VARCHAR(100) NOT NULL  DEFAULT '',
					country VARCHAR(100) NOT NULL  DEFAULT '',
					avgtransaction NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					avgmonthlytransaction NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
					bankstatement VARCHAR(100) NOT NULL  DEFAULT '',
					ssm VARCHAR(100) NOT NULL  DEFAULT '',
					authorizationform VARCHAR(100) NOT NULL  DEFAULT '',
					signboard VARCHAR(100) NOT NULL  DEFAULT '',
					storeleftphoto VARCHAR(100) NOT NULL  DEFAULT '',
					storerightphoto VARCHAR(100) NOT NULL  DEFAULT '',
					workstation VARCHAR(100) NOT NULL  DEFAULT '',
					productphoto1 VARCHAR(100) NOT NULL  DEFAULT '',
					productphoto2 VARCHAR(100) NOT NULL  DEFAULT '',
					productphoto3 VARCHAR(100) NOT NULL  DEFAULT ''
					);
          `
          await client.query(createmerchantInfoTableScript);
          //console.log('Table merchantInfo created successfully!');
        } else {
         const merchantInfoCols= [
            {name:"createby",type:" VARCHAR(100)  NULL"},
{name:"createat",type:" timestamp  NULL"},
{name:"updateby",type:" VARCHAR(100)  NULL"},
{name:"updateat",type:" timestamp  NULL"},
{name:"contactperson",type:" VARCHAR(100)  NULL"},
{name:"mobileno",type:" VARCHAR(100)  NULL"},
{name:"email",type:" VARCHAR(100)  NULL"},
{name:"street",type:" VARCHAR(100)  NULL"},
{name:"address",type:" VARCHAR(100)  NULL"},
{name:"city",type:" VARCHAR(100)  NULL"},
{name:"state",type:" VARCHAR(100)  NULL"},
{name:"postcode",type:" VARCHAR(100)  NULL"},
{name:"country",type:" VARCHAR(100)  NULL"},
{name:"avgtransaction",type:" NUMERIC(10, 2)   NULL"},
{name:"avgmonthlytransaction",type:" NUMERIC(10, 2)   NULL"},
{name:"bankstatement",type:" VARCHAR(100)  NULL"},
{name:"ssm",type:" VARCHAR(100)  NULL"},
{name:"authorizationform",type:" VARCHAR(100)  NULL"},
{name:"signboard",type:" VARCHAR(100)  NULL"},
{name:"storeleftphoto",type:" VARCHAR(100)  NULL"},
{name:"storerightphoto",type:" VARCHAR(100)  NULL"},
{name:"workstation",type:" VARCHAR(100)  NULL"},
{name:"productphoto1",type:" VARCHAR(100)  NULL"},
{name:"productphoto2",type:" VARCHAR(100)  NULL"},
{name:"productphoto3",type:" VARCHAR(100)  NULL"}
         ]
         for(var c=0;c<merchantInfoCols.length;c++){
         let colObj= merchantInfoCols[c];
         let columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'merchantInfo'
            AND column_name = '${colObj.name}'
        );
        `;
        let columnExistsResult = await client.query(columnExistsQuery);
        let columnExists = columnExistsResult.rows[0].exists;

        if (!columnExists) {
            // Add the new column
            const addColumnQuery = `ALTER TABLE merchantInfo ADD COLUMN ${colObj.name} ${colObj.type};`;
            await client.query(addColumnQuery);
        }
        } 
          //console.log('Table merchantInfo already exists.');
        }
      } catch (error) {
        console.log("ERROR: merchantInfo")
        console.error('Error:', error);
      }
    

    try {
        // Check if the table[ownerDetails] exists
        const tableownerDetailsExistsQuery = "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'ownerDetails')";
        const tableownerDetailsExistsResult = await client.query(tableownerDetailsExistsQuery);
        const tableownerDetailsExists = tableownerDetailsExistsResult.rows[0].exists;
    
        if (!tableownerDetailsExists) {
          const createownerDetailsTableScript =`
          CREATE TABLE IF NOT EXISTS  ownerdetails(
					id SERIAL PRIMARY KEY,
					createby VARCHAR(100) NOT NULL  DEFAULT '',
					createat timestamp NOT NULL DEFAULT NOW(),
					updateby VARCHAR(100)  NULL,
					updateat timestamp  NULL,
					name VARCHAR(100) NOT NULL  DEFAULT '',
					contactnumber VARCHAR(100) NOT NULL   UNIQUE,
					email VARCHAR(100) NOT NULL   UNIQUE,
					icno VARCHAR(100) NOT NULL   UNIQUE,
					icfrontimage VARCHAR(100)  NULL,
					icbackimage VARCHAR(100)  NULL
					);
          `
          await client.query(createownerDetailsTableScript);
          //console.log('Table ownerDetails created successfully!');
        } else {
         const ownerDetailsCols= [
            {name:"createby",type:" VARCHAR(100)  NULL"},
{name:"createat",type:" timestamp  NULL"},
{name:"updateby",type:" VARCHAR(100)  NULL"},
{name:"updateat",type:" timestamp  NULL"},
{name:"name",type:" VARCHAR(100)  NULL"},
{name:"contactnumber",type:" VARCHAR(100)  NULL"},
{name:"email",type:" VARCHAR(100)  NULL"},
{name:"icno",type:" VARCHAR(100)  NULL"},
{name:"icfrontimage",type:" VARCHAR(100)  NULL"},
{name:"icbackimage",type:" VARCHAR(100)  NULL"}
         ]
         for(var c=0;c<ownerDetailsCols.length;c++){
         let colObj= ownerDetailsCols[c];
         let columnExistsQuery = `
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'ownerDetails'
            AND column_name = '${colObj.name}'
        );
        `;
        let columnExistsResult = await client.query(columnExistsQuery);
        let columnExists = columnExistsResult.rows[0].exists;

        if (!columnExists) {
            // Add the new column
            const addColumnQuery = `ALTER TABLE ownerDetails ADD COLUMN ${colObj.name} ${colObj.type};`;
            await client.query(addColumnQuery);
        }
        } 
          //console.log('Table ownerDetails already exists.');
        }
      } catch (error) {
        console.log("ERROR: ownerDetails")
        console.error('Error:', error);
      }
    
    await client.end();
  }
//Function uuid_generate_v4() does not exist
//To resolve this problem, just run this command in the SQL Editor
//CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
// YOU SHOULD REMOME THIS FUNCTION IN PRODUCTION
  createTableIfNotExists();
