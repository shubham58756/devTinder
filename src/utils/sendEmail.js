module.exports = {
  run: async (subject, body) => {
    console.warn('sendEmail.run called (stub). Subject:', subject);
    return { success: true };
  },
};
