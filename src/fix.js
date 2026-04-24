const fs = require('fs');
const file = './components/main-ai/MainAIChatWindow.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');

const startIndex = lines.findIndex(line => line.includes('const renderMessageList = (messagesList: Message[], isEducationContext: boolean) => {') && line.includes('1675') === false);
// actually just find the SECOND occurrence
let firstFound = false;
let startIdx = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const renderMessageList = (messagesList: Message[], isEducationContext: boolean) => {')) {
    if (!firstFound) {
      firstFound = true;
    } else {
      startIdx = i;
      break;
    }
  }
}

if (startIdx !== -1) {
  let endIdx = -1;
  // find the closing bracket of the map function and the renderMessageList function
  for (let i = startIdx; i < lines.length; i++) {
    if (lines[i].includes('          })}')) {
      // maybe the closing brace is right after that
      endIdx = i;
      break;
    }
  }
  
  if (endIdx !== -1) {
    const replacement = `          {/* Conversation Messages */}
          {activeApp === 'education' ? renderMessageList(educationMessages, true) : renderMessageList(messages, false)}`;
    
    lines.splice(startIdx, endIdx - startIdx + 1, replacement);
    fs.writeFileSync(file, lines.join('\n'), 'utf8');
    console.log('Fixed duplicated function definition.');
  } else {
    console.log('Could not find end index');
  }
} else {
  console.log('Could not find second occurrence');
}
