export const quizData = {
    "09_convolution_and_binaural_sound_synthesis": Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}: What is a key concept in Convolution and Binaural Sound Synthesis?`,
        options: [
            "The process of combining two signals to form a third signal",
            "A method for reducing noise in audio recordings",
            "A technique for increasing the volume of a sound source",
            "A way to visualize sound waves in 3D space"
        ],
        correct: 0,
        explanation: "Convolution is a mathematical operation that expresses the shape of one function as modified by another."
    })),
    "10_simulation_methods": Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}: Which simulation method is commonly used in acoustics?`,
        options: [
            "Finite Element Method (FEM)",
            "Random Walk Theory",
            "Quantum Monte Carlo",
            "Genetic Algorithms"
        ],
        correct: 0,
        explanation: "FEM is widely used for solving partial differential equations in acoustics."
    })),
    "11_simulation_of_sound_in_rooms": Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}: What affects sound propagation in a room?`,
        options: [
            "Room geometry and surface materials",
            "The color of the walls",
            "The time of day",
            "The type of light bulbs used"
        ],
        correct: 0,
        explanation: "Geometry and materials determine reflection, absorption, and diffraction of sound."
    })),
    "18_acoustic_virtual_reality_systems": Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        question: `Question ${i + 1}: What is essential for an immersive acoustic VR system?`,
        options: [
            "Low latency and high-quality spatial audio",
            "High-resolution video only",
            "A comfortable chair",
            "Wireless keyboard and mouse"
        ],
        correct: 0,
        explanation: "Low latency and spatial audio are critical for believing the auditory environment."
    }))
};
