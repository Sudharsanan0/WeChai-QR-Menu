import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

const QRCodeGenerator = () => {
  const menuUrl = `${window.location.origin}/menu`;

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "menu-qr-code.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code for Menu</CardTitle>
        <CardDescription>
          Download this QR code and display it in your restaurant. Customers can scan it to view your menu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <QRCodeSVG
              id="qr-code-svg"
              value={menuUrl}
              size={256}
              level="H"
              includeMargin={true}
            />
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              QR Code URL:
            </p>
            <code className="text-xs bg-muted px-3 py-1 rounded">
              {menuUrl}
            </code>
          </div>

          <Button onClick={downloadQRCode} size="lg" className="w-full max-w-xs">
            <Download className="w-4 h-4 mr-2" />
            Download QR Code
          </Button>
        </div>

        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">How to use:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Download the QR code image</li>
            <li>Print it or display it on a screen</li>
            <li>Place it where customers can easily scan it</li>
            <li>Customers scan with their phone camera to view the menu</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
