import { useState, useEffect, useRef } from 'react';

export default function usePyodide() {
    const [pyodide, setPyodide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [output, setOutput] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadPyodide = async () => {
            if (window.pyodide) {
                setPyodide(window.pyodide);
                setIsLoading(false);
                return;
            }

            // Load script
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.3/full/pyodide.js";
            script.async = true;
            script.onload = async () => {
                if (!isMounted) return;
                try {
                    const py = await window.loadPyodide();

                    // Load packages needed for science/plotting
                    await py.loadPackage(["numpy", "matplotlib"]);

                    // Redirect stdout
                    py.setStdout({
                        batched: (msg) => {
                            setOutput((prev) => [...prev, { type: 'text', content: msg }]);
                        }
                    });

                    // Define a JS callback for plots
                    window.send_plot = (imgData) => {
                        setOutput((prev) => [...prev, { type: 'image', content: imgData }]);
                    };

                    // Inject Python shim to capture matplotlib figures
                    const pythonShim = `
import matplotlib.pyplot as plt
import io
import base64
from js import send_plot

def show_plot():
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_str = 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('utf-8')
    send_plot(img_str)
    plt.clf()

# Override plt.show
plt.show = show_plot
`;
                    await py.runPythonAsync(pythonShim);

                    if (isMounted) {
                        setPyodide(py);
                        setIsLoading(false);
                    }
                } catch (err) {
                    console.error("Failed to load Pyodide:", err);
                    if (isMounted) setIsLoading(false);
                }
            };
            document.body.appendChild(script);
        };

        loadPyodide();

        return () => {
            isMounted = false;
        };
    }, []);

    const runPython = async (code) => {
        if (!pyodide) return;
        setOutput([]); // Clear previous output
        try {
            // Ensure matplotlib backend is clean
            await pyodide.runPythonAsync("import matplotlib.pyplot as plt; plt.clf()");
            await pyodide.runPythonAsync(code);
        } catch (err) {
            setOutput((prev) => [...prev, { type: 'error', content: `Error: ${err.message}` }]);
        }
    };

    return { pyodide, isLoading, output, runPython, clearOutput: () => setOutput([]) };
}
