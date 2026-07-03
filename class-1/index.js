const {Command} = require("commander")
const fs = require("fs")
const path = require("path")


const program = new Command()
program
  .name('counter')
  .description('CLI to do file based tasks')
  .version('0.8.0');


program.command("h")
.description("Helping yoou with command lines")
  .argument('<name>', 'the person who is asking')
  .option('--a', 'display just the first substring')
  .action((name,options)=>{

    if(options.a){
        console.log("Displaying all commands")
    }else{
        console.log("Displaying only little commands")
    }
  })



program.command('count')
  .description('Count the number of lines in a file')
  .argument('<file>', 'file to count')
  .action((file) => {
    const fileLoc = path.join(__dirname,file)
    console.log(fileLoc,"File Loc ")
    fs.readFile(fileLoc, 'utf8', (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const lines = data.split('\n').length;
        console.log(`There are ${lines} lines in ${file}`);
      }
    });
  });




program.parse();