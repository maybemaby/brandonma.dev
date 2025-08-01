<script lang="ts">
  import { animate, text, stagger } from "animejs";

  let forward = $state(true);

  let el = $state<HTMLElement | null>(null);

  $effect(() => {
    if (el) {
      if (forward) {
        animate(el, {
          x: 200,
          rotate: 720,
          duration: 20_000,
          ease: "outCirc",
        });
      } else {
        animate(el, {
          x: -200,
          rotate: -720,
          duration: 20_000,
          ease: "outCirc",
        });
      }
    }
  });
</script>

<div>
  <div class="mb-4">
    <label for="forward">Forward</label>
    <input id="forward" name="forward" type="checkbox" bind:checked={forward} />
  </div>
  <div class="h-[40px] w-[40px] bg-amber-400" bind:this={el}></div>
</div>
