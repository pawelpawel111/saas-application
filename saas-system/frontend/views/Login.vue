<template>
  <div class="login-container">
    <h2>Logowanie</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label>Hasło:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Zaloguj</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:3000/api/login", {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem("token", response.data.token);
        this.$router.push("/dashboard"); // Przekierowanie po zalogowaniu
      } catch (error) {
        this.errorMessage = "Niepoprawne dane logowania!";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.error {
  color: red;
}
</style>
