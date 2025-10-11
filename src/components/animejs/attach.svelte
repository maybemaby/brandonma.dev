<script lang="ts">
  import { type Attachment } from "svelte/attachments";
  import { animate } from "animejs";

  let value = $state(0);

  const animeAttachment: Attachment = (el) => {
    animate(el, {
      y: [100, 0],
      opacity: [0, 1],
      scale: [0.5, 1],
      duration: 1000,
    });
  };
</script>

<div>
  <div>
    <p>Value: {value}</p>
    <input type="range" min="0" max="100" bind:value />
  </div>
  <div class="flex gap-2 h-[50px] absolute sm:left-1/4 left-0">
    {#each { length: 10 } as _, idx (idx)}
      {#if value >= (idx + 1) * 10}
        <div
          class="rounded-full w-[40px] h-[40px] bg-green-400 text-center"
          {@attach animeAttachment}
        >
          {(idx + 1) * 10}
        </div>
      {/if}
    {/each}
  </div>
</div>
