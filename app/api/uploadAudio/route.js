// pages/api/uploadAudio.js
export async function POST(req) {
    const data = req.formData();
    const file = data.files.file;
    const audioUrl = URL.createObjectURL(file);

    return new Response(JSON.stringify({ url : audioUrl }), { status: 200 });
}
