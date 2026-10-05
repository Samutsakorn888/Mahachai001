const fs = require('fs');
let text = fs.readFileSync('src/components/RoomTypes.tsx', 'utf8');

text = text.replace(
  '  const [expandedImage, setExpandedImage] = useState<string | null>(null);',
  '  const [expandedImage, setExpandedImage] = useState<string | null>(null);\n  const [copiedToast, setCopiedToast] = useState<string | null>(null);'
);

const handleCopyTextCode = `  const handleCopyText = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedToast(label);
      setTimeout(() => setCopiedToast(null), 2500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };`;

text = text.replace(
  '  const handleDownloadPDF = async () => {',
  handleCopyTextCode + '\n\n  const handleDownloadPDF = async () => {'
);

const toastCode = `        {copiedToast && (
          <div className="alert-toast">
            คัดลอก{copiedToast}สำเร็จแล้ว!
          </div>
        )}
      </div>
    </div>`;

// Be careful to only match the last </div> </div> in the file for placing toastCode.
// Actually, let's just append it before the final `</div>\n    </div>\n  );\n};`

text = text.replace(
  /      <\/div>\n    <\/div>\n  \);\n};\n?$/,
  `        {copiedToast && (
          <div className="alert-toast">
            คัดลอก{copiedToast}สำเร็จแล้ว!
          </div>
        )}
      </div>
    </div>
  );
};
`
);


text = text.replace(
  "import { parseArray, parseImageUrl, formatThaiDate, calculateCheckOutDate, formatThaiDateObj } from './RoomTypes/utils';",
  "import { parseArray, parseImageUrl } from './RoomTypes/utils';"
);

text = text.replace(/import React, \{ useState, useRef, useEffect \} from 'react';/, "import React, { useState, useEffect } from 'react';");
text = text.replace(/import \{ createPortal \} from 'react-dom';\n/g, '');
text = text.replace(/import html2canvas from 'html2canvas';\n/g, '');

fs.writeFileSync('src/components/RoomTypes.tsx', text);
