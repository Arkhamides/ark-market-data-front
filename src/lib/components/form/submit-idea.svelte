<script lang="ts">
  let submitted = false;

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/submit-form", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        submitted = true;
        form.reset();
      } else {
        console.error("Form submission failed");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  }
</script>

{#if !submitted}
  <form
    on:submit={handleSubmit}
    class="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
  >
    <label for="message" class="block mb-2 text-gray-700 text-lg font-medium">
      Got an idea? Share it below and we’ll do our best to make it happen!
    </label>
    <input
      type="text"
      id="message"
      name="message"
      placeholder="Your idea here..."
      required
      class="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent mb-4"
    />
    <button
      type="submit"
      class="bg-black text-white px-6 py-2 rounded hover:bg-gray-900 transition"
    >
      Submit
    </button>
  </form>
  <iframe title="form" name="invisible" style="display:none"></iframe>
{:else}
  <div
    class="max-w-2xl w-full mx-auto text-center bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
  >
    <h3 class="text-2xl font-semibold text-black mb-2">Thank you!</h3>
    <p class="text-gray-600">
      We appreciate your feedback! Your idea has been submitted successfully.
    </p>
  </div>
{/if}